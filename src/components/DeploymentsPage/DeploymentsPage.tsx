import {
  Link,
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
  Button,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { buildkiteAPIRef, BuildkiteAPI } from '../../api';
import { StatusIcon } from '../Icons';
import { DeploymentParams } from '../types/buildkiteTypes';
import { formatDate } from '../../utils/date';

interface Props {
  orgSlug: string;
  pipelineSlug: string;
}

export const DeploymentsPage = ({ orgSlug, pipelineSlug }: Props) => {
  const buildkiteApi = useApi<BuildkiteAPI>(buildkiteAPIRef);

  // Define available columns and their initial visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Load saved preferences from localStorage if available
    const savedColumns = localStorage.getItem(
      `buildkite-columns-${orgSlug}-${pipelineSlug}`,
    );
    return savedColumns
      ? JSON.parse(savedColumns)
      : ['deployment', 'stage', 'status', 'commit', 'url', 'version'];
  });

  const { value, loading, error } = useAsync(async () => {
    const [pipeline, deployments] = await Promise.all([
      buildkiteApi.getPipeline(orgSlug, pipelineSlug),
      buildkiteApi.getDeployments(orgSlug, pipelineSlug),
    ]);
    return { pipeline, deployments };
  }, [buildkiteApi, orgSlug, pipelineSlug]);

  // Use the deployments directly as they already have version from meta_data.version
  const processedDeployments = value?.deployments || [];

  const allColumns: TableColumn<DeploymentParams>[] = [
    {
      id: 'deployment',
      title: 'Deployment',
      render: (row: DeploymentParams) => (
        <Link to={row.web_url || row.url} target="_blank" rel="noopener">
          #{row.number}
        </Link>
      ),
    },
    { id: 'stage', title: 'Stage', field: 'stage' },
    {
      id: 'status',
      title: 'Status',
      render: (row: DeploymentParams) => (
        <StatusIcon status={row.status} size="medium" />
      ),
    },
    {
      id: 'commit',
      title: 'Commit',
      render: (row: DeploymentParams) => {
        if (!value?.pipeline.repository) {
          return <>{row.commit}</>;
        }
        return (
          <Link
            to={`${value.pipeline.repository}/commit/${row.commit}`}
            target="_blank"
            rel="noopener"
          >
            {row.commit}
          </Link>
        );
      },
    },
    { id: 'branch', title: 'Branch', field: 'branch' },
    { id: 'author', title: 'Author', field: 'author.name' },
    {
      id: 'createdAt',
      title: 'Created',
      render: (row: DeploymentParams) => formatDate(row.createdAt, false),
    },
    {
      id: 'url',
      title: 'URL',
      render: (row: DeploymentParams) => (
        <Link to={row.url} target="_blank" rel="noopener">
          {row.app ? `${row.url}` : 'Open'}
        </Link>
      ),
    },
    {
      id: 'version',
      title: 'Version',
      render: (row: DeploymentParams) => row.version || '-',
    },
  ];

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  // Sort deployments by build number first, then environment type
  const sortedDeployments = [...processedDeployments].sort((a, b) => {
    // First compare build numbers (higher numbers first)
    if (a.number !== b.number) {
      return b.number - a.number;
    }
    // For same build number, sort by environment (production first)
    if (a.stage === 'production' && b.stage !== 'production') return -1;
    if (a.stage !== 'production' && b.stage === 'production') return 1;
    return 0;
  });

  // Filter columns based on visibility settings
  const visibleColumnsData = allColumns.filter(column =>
    visibleColumns.includes(column.id as string),
  );

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
          Select columns to display:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allColumns.map(column => {
            const isActive = visibleColumns.includes(column.id as string);
            return (
              <Button
                key={column.id as string}
                to=""
                color={isActive ? 'primary' : 'default'}
                variant={isActive ? 'contained' : 'outlined'}
                onClick={() => {
                  const newColumns = isActive
                    ? visibleColumns.filter(c => c !== column.id)
                    : [...visibleColumns, column.id as string];

                  if (newColumns.length > 0) {
                    setVisibleColumns(newColumns);
                    localStorage.setItem(
                      `buildkite-columns-${orgSlug}-${pipelineSlug}`,
                      JSON.stringify(newColumns),
                    );
                  }
                }}
                size="small"
              >
                {column.title}
              </Button>
            );
          })}
        </div>
      </div>

      <Table
        title="Deployments"
        options={{ search: true, paging: true, pageSize: 10 }}
        columns={visibleColumnsData}
        data={sortedDeployments}
      />
    </>
  );
};
