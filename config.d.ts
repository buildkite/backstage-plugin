export interface Config {
  /**
   * Required configuration for the Buildkite plugin
   */
  buildkite: {
    /**
     * The API token which will be used to interact with the Buildkite API
     * @visibility secret
     */
    apiToken: string;
    /**
     * The Buildkite organization slug
     */
    organization: string;
  };
}
