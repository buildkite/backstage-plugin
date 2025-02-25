import { Entity } from '@backstage/catalog-model';

/**
 * The annotation key used to store Buildkite pipeline slug.
 */
export const BUILDKITE_ANNOTATION = 'buildkite.com/pipeline-slug';

/**
 * Extracts the Buildkite project slug from an entity's annotations.
 *
 * @param entity - The entity to extract the slug from
 * @returns The Buildkite project slug or empty string if not found
 */
export function getBuildkiteProjectSlug(entity: Entity): string {
  const projectSlug = entity.metadata.annotations?.[BUILDKITE_ANNOTATION];
  return projectSlug || '';
}

/**
 * Parses a Buildkite project slug into organization and pipeline slugs.
 *
 * @param projectSlug - The project slug in format "organization-slug/pipeline-slug"
 * @returns Object containing separated organizationSlug and pipelineSlug
 * @throws Error if the slug format is invalid
 */
export function parseBuildkiteProjectSlug(projectSlug: string): {
  organizationSlug: string;
  pipelineSlug: string;
} {
  const [organizationSlug, pipelineSlug] = projectSlug.split('/');

  if (!organizationSlug || !pipelineSlug) {
    throw new Error(
      `Invalid Buildkite project slug: ${projectSlug}. Expected format: organization-slug/pipeline-slug`,
    );
  }
  return { organizationSlug, pipelineSlug };
}

/**
 * Checks if Buildkite integration is available for an entity.
 *
 * @param entity - The entity to check
 * @returns True if Buildkite integration is available
 */
export function isBuildkiteAvailable(entity: Entity): boolean {
  try {
    const projectSlug = getBuildkiteProjectSlug(entity);
    if (!projectSlug) return false;

    const { organizationSlug, pipelineSlug } =
      parseBuildkiteProjectSlug(projectSlug);

    return Boolean(organizationSlug && pipelineSlug);
  } catch (error) {
    console.error('Error checking Buildkite availability:', error);
    return false;
  }
}
