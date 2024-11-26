import React from 'react';
import { Typography } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { PipelineView } from '../PipelineView';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { getBuildkiteProjectSlug, parseBuildkiteProjectSlug } from '../../utils';
import { useBuildkiteApi } from '../../hooks/useBuildkiteApi';

export const PipelinePage = () => {
  const { entity } = useEntity();
  
  console.log('Entity loaded:', entity);
  
  const projectSlug = getBuildkiteProjectSlug(entity);
  console.log('Project slug:', projectSlug);
  
  if (!projectSlug) {
    return (
      <Typography>
        Missing Buildkite annotation. Please add buildkite.com/pipeline-slug to your entity.
      </Typography>
    );
  }

  let orgSlug: string;
  let pipelineSlug: string;

  try {
    const parsed = parseBuildkiteProjectSlug(projectSlug);
    orgSlug = parsed.organizationSlug;
    pipelineSlug = parsed.pipelineSlug;
    console.log('Parsed slugs:', { orgSlug, pipelineSlug });
  } catch (error) {
    return <Typography>Invalid pipeline slug format. Expected: organization-slug/pipeline-slug</Typography>;
  }

  const { pipeline, loading, error } = useBuildkiteApi(orgSlug, pipelineSlug);
  console.log('Pipeline data:', { pipeline, loading, error });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!pipeline) {
    return <Typography>Pipeline not found</Typography>;
  }

  return <PipelineView pipeline={pipeline} />;
};
