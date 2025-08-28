import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import {
  Progress,
  ResponseErrorPanel,
  Content,
  Header,
  Page,
  TabbedLayout,
} from '@backstage/core-components';
import { PipelineParams } from '../types/buildkiteTypes';
import { PipelineView } from '../PipelineView/PipelineView';
import { DeploymentsPage } from '../DeploymentsPage';
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
  const params = useParams<{ orgSlug?: string; pipelineSlug?: string }>();
  const orgSlug = propOrgSlug || params.orgSlug || 'default-org';
  const pipelineSlug = propPipelineSlug || params.pipelineSlug || 'default-pipeline';

  const buildkiteApi = useApi(buildkiteAPIRef);
  const [pipeline, setPipeline] = useState<PipelineParams | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<number | undefined>(undefined);
  const isMountedRef = useRef(true);

  const fetchPipelineData = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const pipelineData = await buildkiteApi.getPipeline(
        orgSlug,
        pipelineSlug,
      );

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
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    const id = window.setInterval(fetchPipelineData, POLL_INTERVAL);
    intervalRef.current = id;
  }, [fetchPipelineData]);

  useEffect(() => {
    isMountedRef.current = true;

    fetchPipelineData();
    startPolling();

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [fetchPipelineData, startPolling]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      } else {
        fetchPipelineData();
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

  return (
    <Page themeId="tool">
      <Header title="Buildkite" subtitle={pipeline.name} />
      <Content>
        <TabbedLayout>
          <TabbedLayout.Route path="/builds" title="Builds">
            <PipelineView pipeline={pipeline} onRefresh={fetchPipelineData} />
          </TabbedLayout.Route>
          <TabbedLayout.Route path="/deployments" title="Deployments">
            <DeploymentsPage orgSlug={orgSlug} pipelineSlug={pipelineSlug} />
          </TabbedLayout.Route>
        </TabbedLayout>
      </Content>
    </Page>
  );
};