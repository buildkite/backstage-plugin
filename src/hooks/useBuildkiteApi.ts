import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { buildkiteAPIRef } from '../api';
import { PipelineParams } from '../components/Types';

export const useBuildkiteApi = (orgSlug: string, pipelineSlug: string) => {
  const api = useApi(buildkiteAPIRef);

  const {
    value: pipeline,
    loading,
    error,
  } = useAsync(async (): Promise<PipelineParams | undefined> => {
    if (!orgSlug || !pipelineSlug) {
      return undefined;
    }

    try {
      const pipeline = await api.getPipeline(orgSlug, pipelineSlug);

      return pipeline;
    } catch (err) {
      console.error('Error fetching pipeline:', err);
      throw err;
    }
  }, [orgSlug, pipelineSlug]);

  return {
    pipeline,
    loading,
    error,
  };
};

export const useBuildkiteBuild = (
  orgSlug: string,
  pipelineSlug: string,
  buildNumber: string,
) => {
  const api = useApi(buildkiteAPIRef);

  const { value, loading, error } = useAsync(async () => {
    if (!orgSlug || !pipelineSlug || !buildNumber) {
      return undefined;
    }

    try {
      const pipeline = await api.getPipeline(orgSlug, pipelineSlug);
      const builds = pipeline.builds;
      const build = builds.find(b => b.buildNumber === buildNumber) || null;
      return {
        pipeline,
        build,
        steps: build?.steps || [],
      };
    } catch (err) {
      console.error('Error fetching build:', err);
      throw err;
    }
  }, [orgSlug, pipelineSlug, buildNumber]);

  return {
    pipeline: value?.pipeline || null,
    build: value?.build || null,
    steps: value?.steps || [],
    loading,
    error,
  };
};
