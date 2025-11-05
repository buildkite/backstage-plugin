export interface Config {
  /**
   * Configuration for the Buildkite plugin
   * 
   * Note: The plugin uses the Backstage proxy for API authentication.
   * Organizations and pipelines are configured per-entity via annotations.
   */
  buildkite?: {
    /**
     * Optional API base URL override
     * @visibility frontend
     * @default https://api.buildkite.com/v2
     */
    apiBaseUrl?: string;
    /**
     * Optional default page size for pagination
     * @visibility frontend
     * @default 25
     */
    defaultPageSize?: number;
  };
}
