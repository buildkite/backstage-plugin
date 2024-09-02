import { Entity } from '@backstage/catalog-model';

export const isBuildkiteAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.['buildkite.com/pipeline-slug']);
};
