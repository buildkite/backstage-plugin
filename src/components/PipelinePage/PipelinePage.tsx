import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { PipelineParams } from '../types/buildkiteTypes';
import { PipelineView } from '../PipelineView/PipelineView';
import { useParams } from 'react-router-dom';

const POLL_INTERVAL = 1000; // Poll every second

export interface PipelinePageProps {
  orgSlug?: string;
  pipelineSlug?: string;
}

export const PipelinePage = ({
  orgSlug: propOrgSlug,
  pipelineSlug: propPipelineSlug,
}: PipelinePageProps): JSX.Element => {
  // Get org and pipeline from route params if not passed as props
  const params = useParams<{ orgSlug?: string; pipelineSlug?: string }>();
  
  // Use props if provided, otherwise fall back to route params
  const orgSlug = propOrgSlug || params.orgSlug || "default-org";
  const pipelineSlug = propPipelineSlug || params.pipelineSlug || "default-pipeline";

  const buildkiteApi = useApi(buildkiteAPIRef);
  const [pipeline, setPipeline] = useState<PipelineParams | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);

  // Use refs to keep track of the latest interval ID and mounted state
  const intervalRef = useRef<number>();
  const isMountedRef = useRef(true);

  const fetchPipelineData = useCallback(async () => {
    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return;

    try {
      const pipelineData = await buildkiteApi.getPipeline(
        orgSlug,
        pipelineSlug,
      );

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setPipeline(pipelineData);
        setError(undefined);
      }
    } catch (err) {
      console.error('Error fetching pipeline:', err);
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [buildkiteApi, orgSlug, pipelineSlug]);

  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    // Start new polling interval
    const id = window.setInterval(fetchPipelineData, POLL_INTERVAL);
    intervalRef.current = id;
  }, [fetchPipelineData]);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    // Initial fetch
    fetchPipelineData();

    // Start polling
    startPolling();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [fetchPipelineData, startPolling]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      } else {
        // Fetch immediately when becoming visible
        fetchPipelineData();
        // Restart polling
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPipelineData, startPolling]);

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

  return <PipelineView pipeline={pipeline} onRefresh={fetchPipelineData} />;
};