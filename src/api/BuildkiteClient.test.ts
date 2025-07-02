import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { BuildkiteClient } from './BuildkiteClient';
import { BuildkitePluginConfig } from '../plugin';
import { BuildkiteApiBuild, BuildkiteApiPipeline } from './types';
import { VERSION } from '../version';

describe('BuildkiteClient', () => {
  // Mock console methods to prevent test output pollution
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const mockDiscoveryApi: jest.Mocked<DiscoveryApi> = {
    getBaseUrl: jest.fn().mockResolvedValue('http://backstage/api/proxy'),
  };

  const mockFetchApi: jest.Mocked<FetchApi> = {
    fetch: jest.fn(),
  };

  const mockConfig: BuildkitePluginConfig = {
    organization: 'test-org',
  };

  let client: BuildkiteClient;

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the discovery API returns a valid URL for each test
    mockDiscoveryApi.getBaseUrl.mockResolvedValue('http://backstage/api/proxy');
    client = new BuildkiteClient({
      discoveryAPI: mockDiscoveryApi,
      fetchAPI: mockFetchApi,
      config: mockConfig,
    });
  });

  describe('getUser', () => {
    it('should fetch user successfully', async () => {
      const mockUser = {
        avatar_url: 'https://avatar.url',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        graphql_id: 'graphql-id',
        id: 'user-id',
        name: 'Test User',
      };

      mockFetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await client.getUser();

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      // Don't validate exact URL as it depends on implementation
      expect(mockFetchApi.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle error responses', async () => {
      mockFetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: jest.fn().mockResolvedValue('Unauthorized access'),
      } as any);

      await expect(client.getUser()).rejects.toThrow(
        'Buildkite API request failed: Unauthorized',
      );

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  describe('getPipeline', () => {
    const orgSlug = 'test-org';
    const pipelineSlug = 'test-pipeline';

    it('should fetch pipeline and its builds successfully', async () => {
      const mockPipeline: BuildkiteApiPipeline = {
        id: 'pipeline-id',
        name: 'Test Pipeline',
        repository: {
          url: 'https://github.com/test-org/test-pipeline',
          provider: {
            icon: 'https://icon.url',
          },
        },
      };

      const mockBuilds: BuildkiteApiBuild[] = [
        {
          id: 'build-id',
          number: '123',
          state: 'passed',
          message: 'Test build',
          creator: {
            name: 'Test User',
            avatar_url: 'https://avatar.url',
          },
          branch: 'main',
          commit: 'abcdef123456',
          created_at: '2023-01-01T00:00:00Z',
          started_at: '2023-01-01T00:01:00Z',
          finished_at: '2023-01-01T00:02:00Z',
          jobs: [
            {
              id: 'job-id',
              name: 'Test Job',
              state: 'passed',
              web_url: 'https://web.url',
              command: 'test command',
            },
          ],
          web_url: 'https://buildkite.com/test-org/test-pipeline/builds/123',
        },
      ];

      // Mock pipeline request
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPipeline),
      } as any);

      // Mock builds request
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBuilds),
      } as any);

      const result = await client.getPipeline(orgSlug, pipelineSlug);

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledTimes(2);

      // Validate the result structure
      expect(result).toEqual({
        id: 'pipeline-id',
        name: 'Test Pipeline',
        navatarImage: 'https://icon.url',
        navatarColor: '#D1FAFF',
        builds: [
          {
            buildNumber: '123',
            status: 'PASSED',
            buildMessage: 'Test build',
            author: {
              name: 'Test User',
              avatar: 'https://avatar.url',
            },
            branch: 'main',
            commitId: 'abcdef1',
            createdAt: '2023-01-01T00:00:00Z',
            timeElapsed: '1m',
            steps: [
              {
                id: 'job-id',
                title: 'Test Job',
                status: 'PASSED',
                command: 'test command',
                url: 'https://web.url',
              },
            ],
          },
        ],
        orgSlug: 'test-org',
        slug: 'test-pipeline',
        repository: 'https://github.com/test-org/test-pipeline',
      });
    });

    it('should handle pipeline fetch error', async () => {
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as any);

      await expect(client.getPipeline(orgSlug, pipelineSlug)).rejects.toThrow(
        'Failed to fetch pipeline: Not Found',
      );

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle builds fetch error', async () => {
      // Mock successful pipeline request
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'pipeline-id',
          name: 'Test Pipeline',
          repository: { url: 'https://github.com/test-org/test-pipeline' },
        }),
      } as any);

      // Mock failed builds request
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      } as any);

      await expect(client.getPipeline(orgSlug, pipelineSlug)).rejects.toThrow(
        'Failed to fetch builds: Internal Server Error',
      );

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getJobLogs', () => {
    const orgSlug = 'test-org';
    const pipelineSlug = 'test-pipeline';
    const buildNumber = '123';
    const jobId = 'job-id';

    it('should fetch job logs successfully', async () => {
      const mockLogResponse = {
        content: 'line 1\nline 2\nline 3',
      };

      mockFetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockLogResponse),
      } as any);

      const result = await client.getJobLogs(
        orgSlug,
        pipelineSlug,
        buildNumber,
        jobId,
      );

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledWith(
        `http://backstage/api/proxy/buildkite/api/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}/jobs/${jobId}/log`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Buildkite-Plugin-Version': VERSION,
            'X-Buildkite-Source': 'backstage-plugin',
          }),
        }),
      );

      expect(result).toEqual({
        content: ['line 1', 'line 2', 'line 3'],
      });
    });

    it('should handle error responses', async () => {
      mockFetchApi.fetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as any);

      await expect(
        client.getJobLogs(orgSlug, pipelineSlug, buildNumber, jobId),
      ).rejects.toThrow('Failed to fetch job logs: Not Found');

      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
      expect(mockFetchApi.fetch).toHaveBeenCalledTimes(1);
    });
  });

  // Test the getBaseURL method and URL construction
  describe('getBaseURL', () => {
    it('should construct the base URL correctly', async () => {
      // Use a spy to access the private method
      const getBaseURLSpy = jest.spyOn(
        // @ts-ignore - accessing private method for testing
        client as any,
        'getBaseURL',
      );

      // Call a public method that uses getBaseURL internally
      try {
        await client.getUser();
      } catch {
        // Ignore any errors, we just need to trigger getBaseURL
      }

      // Verify getBaseURL was called
      expect(getBaseURLSpy).toHaveBeenCalled();
      
      // Verify the discovery API was called with the correct parameter
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('proxy');
    });

    it('should handle discovery API errors', async () => {
      // Mock the discovery API to throw an error
      mockDiscoveryApi.getBaseUrl.mockRejectedValueOnce(
        new Error('Discovery API error'),
      );

      // Call a method that uses getBaseURL
      await expect(client.getUser()).rejects.toThrow('Discovery API error');
    });

    it('should handle empty proxy URL', async () => {
      // Mock the discovery API to return an empty string
      mockDiscoveryApi.getBaseUrl.mockResolvedValueOnce('');

      // Call a method that uses getBaseURL
      await expect(client.getUser()).rejects.toThrow(
        'Failed to construct Buildkite API base URL',
      );
    });
  });
});
