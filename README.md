# Buildkite Backstage Plugin

A Buildkite plugin for Backstage.

## Using the plugin

Clone down this repo using your preferred method.

Run the following to create a local instance of Backstage, you'll be prompted for a `name`.

```sh
npx @backstage/create-app@latest
```

Adjust the `app-config` to include the following, you'll need to ensure a value for `BUILDKITE_API_TOKEN` is present in your environment.

```yaml
proxy:
  endpoints:
    '/buildkite/api':
      target: https://api.buildkite.com/v2
      headers:
        Accept: application/json
        Authorization: Bearer ${BUILDKITE_API_TOKEN}
      allowedHeaders: ['Authorization']

...

catalog:
  locations:
    - type: url
      target: https://github.com/organisation/repository/blob/main/path/to/catalog-info.yaml
      rules:
        - allow: [Component, System, API, Resource, Location, Group]
```

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

Then add the following to your `packages/app/src/App.tsx`:

```ts
import {PipelinePage, BuildPage} from '@internal/plugin-buildkite';

...

const routes = (
  <FlatRoutes>
    // Other routesy
    <Route path="/buildkite" element={<PipelinePage />} />
    <Route path="/buildkite/build/:pipelineSlug/:buildNumber" element={<BuildPage />} />
    <Route path="/buildkite/pipeline/:orgSlug/:pipelineSlug" element={<PipelinePage />} />
  </FlatRoutes>
);
```

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
```

And include the `ciCdContent` in the `EntityPage` component:

```ts
const defaultEntityPage = (
  <EntityLayoutWrapper>
    // Other routes
    <EntityLayout.Route path="/buildkite" title="Buildkite">
      {cicdContent}
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);
```

You'll then want to copy (`cp`) this cloned repo in to your Backstage instance and run the instance in `dev` mode:

```sh
cp ./backstage-plugin-buildkite/* ../<backstage instance name>/plugins/buildkite

yarn dev
```
