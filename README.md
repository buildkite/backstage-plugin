# Buildkite Backstage Plugin

A Buildkite plugin for Backstage that provides deep integration with your Buildkite CI/CD pipelines.

## ✨ Features

🔍 **Enhanced Pipeline Visibility**
- Real-time build status monitoring with automatic updates
- Hierarchical branch-based organization of builds
- Detailed step-by-step build progress tracking
- Comprehensive build logs with syntax highlighting

⚡ **Powerful Filtering & Search**
- Full-text search across builds, messages, authors, branches, and commit IDs
- Smart date range filtering with preset options (Today, Yesterday, Last 7 days, Last 30 days)
- Multi-criteria filtering by branch, creator, and build status
- Automatic status-based grouping and organization

📖 **Rich Build Information**
- Detailed build status with step-by-step progress
- Build timing and duration tracking
- Commit and branch context
- Author information with avatars
- Build trigger information

🛠️ **Interactive Build Management**
- One-click rebuild functionality
- Expandable/collapsible build details
- Interactive build step inspection
- Direct links to Buildkite

⚙️ **Advanced Customization**
- UTC/Local time toggle with persistent preferences
- Branch-level collapsing
- Automatic expansion of running builds
- Custom pipeline styling with avatars

## Prerequisites

- Buildkite account with API access
- Required API token permissions:
  - `read_pipelines`
  - `read_builds`
  - `read_user`
  - `write_builds` (for rebuild functionality)

## Installation

### Plugin Installation

If the plugin is in your project's plugins directory:

```bash
yarn workspace app add @buildkite/backstage-plugin-buildkite
```

If you're installing from an external package:

```bash
yarn workspace app add @buildkite/backstage-plugin-buildkite
```

### Configuration

1. Add the proxy configuration to your `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/buildkite/api':
      target: https://api.buildkite.com/v2
      headers:
        Authorization: Bearer ${BUILDKITE_API_TOKEN}
        Accept: application/json
      allowedHeaders: ['Authorization']

buildkite:
  apiToken: ${BUILDKITE_API_TOKEN}
  organization: ${BUILDKITE_ORGANIZATION}
```

2. Create or update `packages/app/src/plugins.ts` to register the plugin:

```typescript
// Import plugins that you want to be included in your app
export { buildkitePlugin } from '@buildkite/backstage-plugin-buildkite';
```

3. Make sure to import the plugins file in your `packages/app/src/App.tsx`:

```typescript
// Import plugins
import './plugins';
```

4. Add the API factory in `packages/app/src/apis.ts`:

```typescript
import { buildkiteAPIRef, BuildkiteClient } from '@buildkite/backstage-plugin-buildkite';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: buildkiteAPIRef,
    deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef, configApi: configApiRef },
    factory: ({ discoveryApi, fetchApi, configApi }) => {
      const buildkiteConfig = configApi.getOptionalConfig('buildkite');
      return new BuildkiteClient({
        discoveryAPI: discoveryApi,
        fetchAPI: fetchApi,
        config: {
          organization: buildkiteConfig?.getOptionalString('organization') ?? 'default-org',
          defaultPageSize: buildkiteConfig?.getOptionalNumber('defaultPageSize') ?? 25,
          apiBaseUrl: buildkiteConfig?.getOptionalString('apiBaseUrl') ?? 'https://api.buildkite.com/v2',
        },
      });
    },
  }),
];
```

5. Add routes in `packages/app/src/App.tsx`:

```typescript
import { PipelinePage } from '@buildkite/backstage-plugin-buildkite';

const routes = (
  <FlatRoutes>
    {/* Other routes... */}

    {/* Buildkite Plugin Routes */}
    <Route path="/buildkite" element={<PipelinePage />} />
    <Route path="/buildkite/pipeline/:orgSlug/:pipelineSlug" element={<PipelinePage />} />
  </FlatRoutes>
);
```

6. Add to your Entity Page in `packages/app/src/components/catalog/EntityPage.tsx`:

```typescript
import { isBuildkiteAvailable, BuildkiteWrapper } from '@buildkite/backstage-plugin-buildkite';

const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isBuildkiteAvailable}>
      <BuildkiteWrapper />
    </EntitySwitch.Case>
    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="Add a Buildkite annotation to enable CI/CD visualization"
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const defaultEntityPage = (
  <EntityLayout>
    {/* Other routes... */}

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>
  </EntityLayout>
);
```

### Component Configuration

Add the Buildkite annotation to your component's `catalog-info.yaml`:

```yaml
metadata:
  annotations:
    buildkite.com/pipeline-slug: organization-slug/pipeline-slug
```

## Documentation

- [Deployment Tracking](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Contributing/Development Guide](docs/CONTRIBUTING.md)
