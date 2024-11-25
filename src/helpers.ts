import { Entity } from "@backstage/catalog-model";

/**
 * Annotation key for the Buildkite pipeline slug.
 * @public
 */
export const BUILDKITE_REPO_ANNOTATION = "buildkite.com/pipeline-slug";

/**
 * Checks if the given entity has a Buildkite pipeline slug annotation.
 *
 * @param entity - The entity to check.
 * @returns `true` if the entity has a Buildkite pipeline slug annotation, otherwise `false`.
 * @public
 */
export const isBuildkiteAvailable = (entity: Entity): boolean => {
    const buildkiteRepo =
        entity.metadata.annotations?.[BUILDKITE_REPO_ANNOTATION];
    return Boolean(buildkiteRepo);
};
