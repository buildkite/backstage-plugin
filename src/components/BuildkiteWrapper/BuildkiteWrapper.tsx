import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { EmptyState } from '@backstage/core-components';
import { PipelinePage } from '../PipelinePage';
import {
  getBuildkiteProjectSlug,
  parseBuildkiteProjectSlug,
} from '../../utils';

export const BuildkiteWrapper = () => {
  const { entity } = useEntity();

  try {
    const projectSlug = getBuildkiteProjectSlug(entity);
    if (!projectSlug) {
      return (
        <EmptyState
          title="Missing Buildkite Information"
          missing="info"
          description={
            <>
              <p>
                This component is missing the required Buildkite annotation:
              </p>
              <p>
                buildkite.com/pipeline-slug: organization-slug/pipeline-slug
              </p>
            </>
          }
        />
      );
    }

    const { organizationSlug, pipelineSlug } =
      parseBuildkiteProjectSlug(projectSlug);

    return (
      <PipelinePage orgSlug={organizationSlug} pipelineSlug={pipelineSlug} />
    );
  } catch (error) {
    return (
      <EmptyState
        title="Invalid Buildkite Configuration"
        missing="info"
        description={
          <>
            <p>The Buildkite annotation is invalid. Expected format:</p>
            <p>buildkite.com/pipeline-slug: organization-slug/pipeline-slug</p>
          </>
        }
      />
    );
  }
};
