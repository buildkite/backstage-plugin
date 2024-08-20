export interface Config {
  app: {
    baseUrl: string;
    title?: string;
  };
  buildkite: {
    apiToken: string;
  };
}
