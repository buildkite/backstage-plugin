import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { EmptyState } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core';
import {
  getBuildkiteProjectSlug,
  parseBuildkiteProjectSlug,
} from '../../utils';
import { BuildkiteHeader, PipelinePage } from '..';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
});

export const BuildkiteWrapper = () => {
  const classes = useStyles();
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
      <div className={classes.wrapper}>
        <BuildkiteHeader
          title="Buildkite"
          subtitle={`${organizationSlug}/${pipelineSlug}`}
        />
        <div className={classes.content}>
          <PipelinePage
            orgSlug={organizationSlug}
            pipelineSlug={pipelineSlug}
          />
        </div>
      </div>
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
