import { buildkitePlugin } from './plugin';

describe('buildkite', () => {
  it('should export plugin', () => {
    expect(buildkitePlugin).toBeDefined();
  });
});
