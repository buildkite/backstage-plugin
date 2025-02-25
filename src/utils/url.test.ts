import {
  getBuildkiteUrl,
  getBuildkiteJobUrl,
  getBuildkitePipelineUrl,
  getBuildkiteApiBaseUrl,
  getBuildkitePipelineApiUrl,
  getBuildkiteBuildsApiUrl,
  getBuildkiteJobLogsApiUrl,
} from './url';

describe('getBuildkiteUrl', () => {
  it('constructs a valid Buildkite URL', () => {
    const url = getBuildkiteUrl('org-slug', 'pipeline-slug', '123');
    expect(url).toBe('https://buildkite.com/org-slug/pipeline-slug/builds/123');
  });

  it('handles special characters in slugs', () => {
    const url = getBuildkiteUrl('org-with-dash', 'pipeline-with-dash', '456');
    expect(url).toBe(
      'https://buildkite.com/org-with-dash/pipeline-with-dash/builds/456',
    );
  });
});

describe('getBuildkiteJobUrl', () => {
  it('constructs a valid Buildkite job URL', () => {
    const url = getBuildkiteJobUrl(
      'org-slug',
      'pipeline-slug',
      '123',
      'job-id',
    );
    expect(url).toBe(
      'https://buildkite.com/org-slug/pipeline-slug/builds/123#job-id',
    );
  });
});

describe('getBuildkitePipelineUrl', () => {
  it('constructs a valid Buildkite pipeline URL', () => {
    const url = getBuildkitePipelineUrl('org-slug', 'pipeline-slug');
    expect(url).toBe('https://buildkite.com/org-slug/pipeline-slug');
  });
});

describe('getBuildkiteApiBaseUrl', () => {
  it('constructs a valid Buildkite API base URL', () => {
    const url = getBuildkiteApiBaseUrl('http://localhost:7000/proxy');
    expect(url).toBe('http://localhost:7000/proxy/buildkite/api');
  });

  it('handles proxy URLs with trailing slash', () => {
    const url = getBuildkiteApiBaseUrl('http://localhost:7000/proxy/');
    expect(url).toBe('http://localhost:7000/proxy/buildkite/api');
  });

  it('handles proxy URLs with many trailing slashes', () => {
    const url = getBuildkiteApiBaseUrl('http://localhost:7000/proxy///');
    expect(url).toBe('http://localhost:7000/proxy/buildkite/api');
  });
});

describe('getBuildkitePipelineApiUrl', () => {
  it('constructs a valid Buildkite pipeline API URL', () => {
    const baseUrl = 'http://localhost:7000/proxy/buildkite/api';
    const url = getBuildkitePipelineApiUrl(
      baseUrl,
      'org-slug',
      'pipeline-slug',
    );
    expect(url).toBe(
      'http://localhost:7000/proxy/buildkite/api/organizations/org-slug/pipelines/pipeline-slug',
    );
  });
});

describe('getBuildkiteBuildsApiUrl', () => {
  it('constructs a valid Buildkite builds API URL', () => {
    const baseUrl = 'http://localhost:7000/proxy/buildkite/api';
    const url = getBuildkiteBuildsApiUrl(baseUrl, 'org-slug', 'pipeline-slug');
    expect(url).toBe(
      'http://localhost:7000/proxy/buildkite/api/organizations/org-slug/pipelines/pipeline-slug/builds',
    );
  });
});

describe('getBuildkiteJobLogsApiUrl', () => {
  it('constructs a valid Buildkite job logs API URL', () => {
    const baseUrl = 'http://localhost:7000/proxy/buildkite/api';
    const url = getBuildkiteJobLogsApiUrl(
      baseUrl,
      'org-slug',
      'pipeline-slug',
      '123',
      'job-id',
    );
    expect(url).toBe(
      'http://localhost:7000/proxy/buildkite/api/organizations/org-slug/pipelines/pipeline-slug/builds/123/jobs/job-id/log',
    );
  });
});
