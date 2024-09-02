# Buildkite Backstage Plugin

A Buildkite plugin for Backstage.

## Development

Clone down this repo using your preferred method.

Run the following to create a local instance of Backstage, you'll be prompted for a `name`.

```sh
npx @backstage/create-app@latest
```

Adjust the `app-config` to include the following, you'll need to ensure a value for `BUILDKITE_API_TOKEN` is present in your environment.

```yaml
proxy:
    '/buildkite/api':
        target: https://api.buildkite.com/v2
        headers:
        Authorization: Bearer ${BUILDKITE_API_TOKEN}
```

In your `packages/app/components/catalog/EntityPage.tsx` add the following:

```react
const cicdContent = (
  <EntityLayout.Route path="/ci-cd" title="Buildkite">
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6}>
        <PipelinePage />
      </Grid>
    </Grid>
  </EntityLayout.Route>
);
```

You'll then want to copy (`cp`) this cloned repo in to your Backstage instance and run the instance in `dev` mode:

```sh
cp ./backstage-plugin-buildkite ../<backstage instance name>/plugins

yarn dev
``


