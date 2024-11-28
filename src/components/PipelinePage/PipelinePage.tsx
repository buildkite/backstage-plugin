import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { PipelineView } from '../PipelineView';
import { PipelineParams } from '../Types';

interface PipelinePageProps {
  orgSlug: string;
  pipelineSlug: string;
}

export const PipelinePage: React.FC<PipelinePageProps> = ({
  orgSlug,
  pipelineSlug,
}) => {
  const buildkiteApi = useApi(buildkiteAPIRef);
  const [pipeline, setPipeline] = useState<PipelineParams | undefined>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  const fetchPipelineData = useCallback(async () => {
    try {
      const pipelineData = await buildkiteApi.getPipeline(
        orgSlug,
        pipelineSlug,
      );
      setPipeline(pipelineData);
      setError(undefined);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [buildkiteApi, orgSlug, pipelineSlug]);

  useEffect(() => {
    fetchPipelineData();

    const intervalId = setInterval(fetchPipelineData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchPipelineData]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!pipeline) {
    return (
      <ResponseErrorPanel error={new Error('No pipeline data available')} />
    );
  }

  return <PipelineView pipeline={pipeline} />;
};
