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
  return `${proxyPath}/buildkite/api`.replace(/([^:]\/)\/+/g, '$1');
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
