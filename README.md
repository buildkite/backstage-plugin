# Buildkite Backstage Plugin

A Buildkite plugin for Backstage that provides deep integration with your Buildkite CI/CD pipelines. This plugin allows you to monitor the status of your pipelines and manage their builds from a single interface.

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

2. Add the API factory in `packages/app/src/apis.ts`:

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

3. Add routes in `packages/app/src/App.tsx`:

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

4. Add to your Entity Page in `packages/app/src/components/catalog/EntityPage.tsx`:

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

For further usage tips for the Buildkite plugin for Backstage, as well as deployment visibility overview and troubleshooting, see the the official Buildkite Documentation:
- [Plugin overview](https://buildkite.com/docs/pipelines/integrations/other/backstage)
- [Deployment tracking](https://buildkite.com/docs/pipelines/integrations/other/backstage#deployment-tracking)
- [Deployment visibility with Backstage](https://buildkite.com/docs/pipelines/deployments/deployment-visibility-with-backstage)

## Development

For guidelines and requirements regarding contributing to the Buildkite Agent Stack for Kubernetes controller, please see the [Contributing/Development Guide](docs/CONTRIBUTING.md).
