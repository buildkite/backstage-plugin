# Buildkite Backstage Plugin

A Buildkite plugin for Backstage.

## ✨ Features

🔍 **Pipeline Visibility**
- View Buildkite pipelines directly within Backstage
- Real-time build status monitoring
- Branch-based organization of builds

⚡️ **Advanced Filtering**
- Quick search across builds, authors, branches and commits
- Filter by branch, creator, and build status
- Date range filtering with preset options
- Group builds by branch

📊 **Build Information**
- Detailed build status and progress
- Step-by-step build visibility
- Build timing and creation details

🛠️ **Build Management**
- Rebuild functionality for builds
- Expandable build details
- Build author and commit information

⚙️ **Customization**
- UTC/Local time toggle
- Collapse/expand build views
- Custom pipeline styling

## Prerequisites
- Buildkite account with API access
- Required API token permissions:
  - `read_pipelines`
  - `read_builds` 
  - `read_user`
  - `write_builds` (optional, for rebuild functionality)

## Installation

### Plugin Installation

Clone down this repo using your preferred method.

Run the following to create a local instance of Backstage, you'll be prompted for a `name`.

```sh
npx @backstage/create-app@latest
```

### Basic Configuration

Adjust the `app-config.yaml` to include the following, you'll need to ensure a value for `BUILDKITE_API_TOKEN` is present in your environment:

```yaml
proxy:
  endpoints:
    '/buildkite/api':
      target: https://api.buildkite.com/v2
      headers:
        Accept: application/json
        Authorization: Bearer ${BUILDKITE_API_TOKEN}
      allowedHeaders: ['Authorization']

catalog:
  locations:
    - type: url
      target: https://github.com/organisation/repository/blob/main/path/to/catalog-info.yaml
      rules:
        - allow: [Component, System, API, Resource, Location, Group]
```

### API Configuration

Add the following to your `packages/app/src/apis.ts`:

```ts
import { buildkiteApiRef, BuildkiteClient } from '@internal/plugin-buildkite';

export const apis: AnyApiFactory[] = [
  // Other APIs
  createApiFactory({
    api: buildkiteAPIRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, fetchApi, configApi }) => {
      const config = configApi.getOptionalConfig('buildkite')?.get() ?? {};
      return new BuildkiteClient({
        discoveryAPI: discoveryApi,
        fetchAPI: fetchApi,
        config: config,
      });
    },
  }),
];
```

### Route Configuration

Add the following to your `packages/app/src/App.tsx`:

```ts
import {PipelinePage, BuildPage} from '@internal/plugin-buildkite';

const routes = (
  <FlatRoutes>
    // Other routes
    <Route path="/buildkite" element={<PipelinePage />} />
    <Route path="/buildkite/build/:pipelineSlug/:buildNumber" element={<BuildPage />} />
    <Route path="/buildkite/pipeline/:orgSlug/:pipelineSlug" element={<PipelinePage />} />
  </FlatRoutes>
);
```

### Entity Integration

In your `packages/app/components/catalog/EntityPage.tsx` add the following:

```ts
import { isBuildkiteAvailable } from '@internal/plugin-buildkite';
import { BuildkiteWrapper } from '@internal/plugin-buildkite';

export const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isBuildkiteAvailable}>
      <BuildkiteWrapper />
    </EntitySwitch.Case>
    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description={
          <>
            <p>You need to add an annotation to your component if you want to enable CI/CD for it.</p>
          </>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const defaultEntityPage = (
  <EntityLayoutWrapper>
    // Other routes
    <EntityLayout.Route path="/buildkite" title="Buildkite">
      {cicdContent}
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);
```

### Component Configuration
Add the following annotation to your component's catalog-info.yaml:
```yaml
metadata:
  annotations:
    buildkite.com/pipeline-slug: organization-slug/pipeline-slug
```    

### Final Setup

Copy (`cp`) this cloned repo into your Backstage instance and run the instance in `dev` mode:

```sh
cp ./backstage-plugin/* ../<backstage instance name>/plugins/buildkite

yarn dev
```

## Development

### Local Development
```sh
# Install dependencies
yarn install

# Start plugin in development
yarn start

# Run tests
yarn test

# Build plugin
yarn build
```

## Troubleshooting

### Common Issues
1. **Missing Buildkite Information**
   - Ensure your component has the correct Buildkite annotation
   - Verify API token permissions
   - Check that the pipeline slug format matches `organization-slug/pipeline-slug`

2. **Builds Not Showing**
   - Verify API token has required permissions
   - Check pipeline slug format
   - Ensure builds exist in the specified date range

3. **API Access Issues**
   - Confirm `BUILDKITE_API_TOKEN` is set in your environment
   - Verify proxy configuration in `app-config.yaml`
   - Check API token permissions match requirements
