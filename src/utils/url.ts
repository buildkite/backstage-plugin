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
    
  // Construct the API URL to match the proxy configuration
  // The proxy config typically has a pathRewrite like '^/api/proxy/buildkite/api' : ''
  // So we need to ensure our URL matches this pattern
  // 
  // The proxy configuration expects the URL to be in the format:
  // /api/proxy/buildkite/api/<endpoint>
  // And it will rewrite this to:
  // <target>/<endpoint>
  // Where <target> is the base URL specified in the proxy config (e.g., https://api.buildkite.com/v2)
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
 * @returns Full URL to the builds API endpoint
 */
export function getBuildkiteBuildsApiUrl(
  baseUrl: string,
  organizationSlug: string,
  pipelineSlug: string,
): string {
  return `${baseUrl}/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds`;
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
