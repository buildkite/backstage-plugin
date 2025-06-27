# Tracking Deployments

The plugin can track deployments across your Buildkite pipelines. There are three ways to mark a build as a deployment:

## 1. Using the `environment` metadata field

Set the `environment` metadata field in your Buildkite build using the buildkite-agent command:

```yaml
# In your pipeline.yml
steps:
  - label: "Deploy to Production"
    command: |
      buildkite-agent meta-data set "environment" "production"
      ./scripts/deploy.sh
```

## 2. Using the app:environment:deployed pattern

For deployments where you want to track both the application name and environment:

```yaml
# In your pipeline.yml
steps:
  - label: "Deploy Frontend to Staging"
    command: |
      buildkite-agent meta-data set "frontend:staging:deployed" "true"
      ./scripts/deploy-frontend-staging.sh
    branches: "main"

  - label: "Deploy Backend to Staging"
    command: |
      buildkite-agent meta-data set "backend:staging:deployed" "true"
      ./scripts/deploy-backend-staging.sh
    branches: "main"
```

This format allows you to track multiple applications deployed to different environments and will display both the application name and environment in the deployments view.

## 3. Using environment-specific deployment flags

For pipelines that deploy to multiple environments sequentially (e.g., staging then production), you can use environment-specific flags:

```yaml
# In your pipeline.yml
steps:
  - label: "Deploy to Staging"
    command: |
      buildkite-agent meta-data set "staging_deployment" "true"
      ./scripts/deploy-staging.sh
    branches: "main"

  - block: "Promote to Production?"
    branches: "main"

  - label: "Deploy to Production"
    command: |
      buildkite-agent meta-data set "production_deployment" "true"
      ./scripts/deploy-production.sh
    branches: "main"
```

This allows tracking multiple deployments from a single build as they progress through your environments.