import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { PipelineView } from '../PipelineView';
import { PipelineParams } from '../Types';

const POLL_INTERVAL = 1000; // Poll every second

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

  // Use refs to keep track of the latest interval ID and mounted state
  const intervalRef = useRef<number>();
  const isMountedRef = useRef(true);

  const fetchPipelineData = useCallback(async () => {
    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return;

    try {
      console.log('Fetching pipeline data...', { orgSlug, pipelineSlug });
      const pipelineData = await buildkiteApi.getPipeline(
        orgSlug,
        pipelineSlug,
      );
      console.log('Received pipeline data:', pipelineData);

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
        console.log('Tab hidden, pausing polling');
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      } else {
        console.log('Tab visible, resuming polling');
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

  return <PipelineView pipeline={pipeline} />;
};
