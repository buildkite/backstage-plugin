export interface Config {
  app: {
    baseUrl: string;
    title?: string;
  };
  backend: {
    baseUrl: string;
    listen: {
      port: number;
    };
  };
  buildkite: {
    apiToken: string;
  };
}
