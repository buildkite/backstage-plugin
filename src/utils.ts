import { Entity } from '@backstage/catalog-model';

export const BUILDKITE_ANNOTATION = 'buildkite.com/pipeline-slug';

export function getBuildkiteProjectSlug(entity: Entity): string {
  const projectSlug = entity.metadata.annotations?.[BUILDKITE_ANNOTATION];
  return projectSlug || '';
}

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

export function getBuildkiteUrl(
  organizationSlug: string,
  pipelineSlug: string,
  buildNumber: string,
): string {
  return `https://buildkite.com/${organizationSlug}/${pipelineSlug}/builds/${buildNumber}`;
}
