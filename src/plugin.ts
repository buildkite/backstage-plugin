import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  configApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { BuildkiteClient, buildkiteAPIRef } from './api';
import { buildkiteRouteRef } from './routes';

/**
 * The configuration for the buildkite plugin.
 */
export interface BuildkitePluginConfig {
  /**
   * The Buildkite organization slug
   */
  organization: string;
  /**
   * The number of builds to fetch per page (optional)
   * @default 25
   */
  defaultPageSize?: number;
  /**
   * Custom API base URL (optional)
   * @default https://api.buildkite.com/v2
   */
  apiBaseUrl?: string;
}

export const buildkitePlugin = createPlugin({
  id: 'buildkite',
  apis: [
    createApiFactory({
      api: buildkiteAPIRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        config: configApiRef,
      },
      factory: ({ discoveryApi, fetchApi, config }) => {
        const buildkiteConfig = config.getOptionalConfig('buildkite');
        
        const pluginConfig: BuildkitePluginConfig = {
          organization: buildkiteConfig?.getString('organization') ?? '',
          defaultPageSize: buildkiteConfig?.getOptionalNumber('defaultPageSize') ?? 25,
          apiBaseUrl: buildkiteConfig?.getOptionalString('apiBaseUrl'),
        };

        if (!pluginConfig.organization) {
          throw new Error(
            'Missing required config value for buildkite.organization',
          );
        }

        return new BuildkiteClient({
          discoveryApi,
          fetchApi,
          config: pluginConfig,
        });
      },
    }),
  ],
  routes: {
    root: buildkiteRouteRef,
  },
});

export const EntityBuildkiteContent = buildkitePlugin.provide(
  createRoutableExtension({
    name: 'EntityBuildkiteContent',
    component: () => import('./components/PipelinePage/Pipelines').then(m => m.PipelinePage as any),
    mountPoint: buildkiteRouteRef,
  }),
);

export { PipelinePage } from './components/PipelinePage';
export { BuildPage } from './components/BuildPage';
