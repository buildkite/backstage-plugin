import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  configApiRef,
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
        discoveryAPI: discoveryApiRef,
        fetchAPI: fetchApiRef,
        config: configApiRef,
      },
      factory: ({ discoveryAPI, fetchAPI, config }) => {
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
          discoveryAPI,
          fetchAPI,
          config: pluginConfig,
        });
      },
    }),
  ],
  routes: {
    root: buildkiteRouteRef,
  },
});

export { PipelinePage } from './components/PipelinePage';
export { BuildPage } from './components/BuildPage';
