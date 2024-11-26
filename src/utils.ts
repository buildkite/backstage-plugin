import { Entity } from '@backstage/catalog-model';

export const BUILDKITE_ANNOTATION = 'buildkite.com/pipeline-slug';

export function getBuildkiteProjectSlug(entity: Entity): string {
  console.log('Getting Buildkite project slug:', {
    annotations: entity.metadata.annotations,
    specificAnnotation: entity.metadata.annotations?.[BUILDKITE_ANNOTATION],
    annotationKey: BUILDKITE_ANNOTATION,
  });
  
  // Make sure we're accessing the annotation correctly
  const projectSlug = entity.metadata.annotations?.[BUILDKITE_ANNOTATION];
  return projectSlug || '';
}

export function parseBuildkiteProjectSlug(projectSlug: string): {
  organizationSlug: string;
  pipelineSlug: string;
} {
  console.log('Parsing Buildkite project slug:', {
    projectSlug,
    splitResult: projectSlug.split('/'),
  });
  
  const [organizationSlug, pipelineSlug] = projectSlug.split('/');
  
  if (!organizationSlug || !pipelineSlug) {
    throw new Error(
      `Invalid Buildkite project slug: ${projectSlug}. Expected format: organization-slug/pipeline-slug`,
    );
  }
  return { organizationSlug, pipelineSlug };
}

export function isBuildkiteAvailable(entity: Entity): boolean {
  const projectSlug = getBuildkiteProjectSlug(entity);
  console.log('Checking Buildkite availability:', {
    entityName: entity.metadata.name,
    projectSlug,
    hasAnnotation: Boolean(projectSlug),
    annotations: entity.metadata.annotations,
  });
  return Boolean(projectSlug);
}
