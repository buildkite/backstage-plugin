/**
 * Constructs a Buildkite URL for a specific build.
 *
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @param buildNumber - The build number
 * @returns Full URL to the build in Buildkite
 */
export function getBuildkiteUrl(
  organizationSlug: string,
  pipelineSlug: string,
  buildNumber: string,
): string {
  return `https://buildkite.com/${organizationSlug}/${pipelineSlug}/builds/${buildNumber}`;
}

/**
 * Constructs a Buildkite URL for a specific job within a build.
 *
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @param buildNumber - The build number
 * @param jobId - The job ID
 * @returns Full URL to the job within a build in Buildkite
 */
export function getBuildkiteJobUrl(
  organizationSlug: string,
  pipelineSlug: string,
  buildNumber: string,
  jobId: string,
): string {
  return `${getBuildkiteUrl(organizationSlug, pipelineSlug, buildNumber)}#${jobId}`;
}

/**
 * Constructs a Buildkite URL for a pipeline.
 *
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @returns Full URL to the pipeline in Buildkite
 */
export function getBuildkitePipelineUrl(
  organizationSlug: string,
  pipelineSlug: string,
): string {
  return `https://buildkite.com/${organizationSlug}/${pipelineSlug}`;
}

/**
 * Constructs a Buildkite API URL for the base API.
 *
 * @param proxyPath - The proxy path for the Backstage API
 * @returns Full URL to the Buildkite API through the proxy
 */
export function getBuildkiteApiBaseUrl(proxyPath: string): string {
  if (!proxyPath) {
    console.error('No proxy path provided to getBuildkiteApiBaseUrl');
    return '';
  }
  
  // Ensure we have a clean base URL without trailing slashes
  const cleanProxyPath = proxyPath.endsWith('/') 
    ? proxyPath.slice(0, -1) 
    : proxyPath;
    
  // Check if the path already ends with /buildkite/api
  if (cleanProxyPath.endsWith('/buildkite/api')) {
    return cleanProxyPath;
  }
  
  // Check if the path contains /api/proxy or similar pattern
  // This handles both /api/proxy and /idp/api/proxy cases
  if (cleanProxyPath.includes('/api/proxy')) {
    // Extract the base part up to and including /api/proxy
    const basePart = cleanProxyPath.match(/(.+\/api\/proxy)/);
    if (basePart && basePart[1]) {
      return `${basePart[1]}/buildkite/api`;
    }
  }
  
  // Default fallback to the original behavior
  return `${cleanProxyPath}/buildkite/api`;
}

/**
 * Constructs a Buildkite API URL for accessing pipeline information.
 *
 * @param baseUrl - The base API URL
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @returns Full URL to the pipeline API endpoint
 */
export function getBuildkitePipelineApiUrl(
  baseUrl: string,
  organizationSlug: string,
  pipelineSlug: string,
): string {
  return `${baseUrl}/organizations/${organizationSlug}/pipelines/${pipelineSlug}`;
}

/**
 * Constructs a Buildkite API URL for accessing builds information.
 *
 * @param baseUrl - The base API URL
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @param options - Options for the builds API endpoint
 * @returns Full URL to the builds API endpoint
 */
export function getBuildkiteBuildsApiUrl(
  baseUrl: string,
  organizationSlug: string,
  pipelineSlug: string,
  options?: { page?: number; per_page?: number; branch?: string },
): string {
  const url = new URL(`${baseUrl}/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds`);

  if (options?.page) {
    url.searchParams.append('page', String(options.page));
  }

  if (options?.per_page) {
    url.searchParams.append('per_page', String(options.per_page));
  }

  if (options?.branch) {
    url.searchParams.append('branch', options.branch);
  }

  return url.href;
}

/**
 * Constructs a Buildkite API URL for accessing job logs.
 *
 * @param baseUrl - The base API URL
 * @param organizationSlug - The Buildkite organization slug
 * @param pipelineSlug - The Buildkite pipeline slug
 * @param buildNumber - The build number
 * @param jobId - The job ID
 * @returns Full URL to the job logs API endpoint
 */
export function getBuildkiteJobLogsApiUrl(
  baseUrl: string,
  organizationSlug: string,
  pipelineSlug: string,
  buildNumber: string,
  jobId: string,
): string {
  return `${baseUrl}/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}/jobs/${jobId}/log`;
}
