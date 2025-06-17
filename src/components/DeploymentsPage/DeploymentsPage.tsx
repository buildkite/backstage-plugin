import { Link, Progress, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import React from 'react';
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

  const { value, loading, error } = useAsync(async () => {
    const [pipeline, deployments] = await Promise.all([
      buildkiteApi.getPipeline(orgSlug, pipelineSlug),
      buildkiteApi.getDeployments(orgSlug, pipelineSlug),
    ]);
    return { pipeline, deployments };
  }, [buildkiteApi, orgSlug, pipelineSlug]);

  const columns: TableColumn<DeploymentParams>[] = [
    {
      title: 'Deployment',
      render: (row: DeploymentParams) => (
        <Link to={row.url} target="_blank" rel="noopener">
          #{row.number}
        </Link>
      ),
    },
    { title: 'Stage', field: 'stage' },
    {
      title: 'Status',
      render: (row: DeploymentParams) => <StatusIcon status={row.status} size="medium" />,
    },
    {
      title: 'Commit',
      render: (row: DeploymentParams) => {
        if (!value?.pipeline.repository) {
          return <>{row.commit}</>;
        }
        return (
          <Link to={`${value.pipeline.repository}/commit/${row.commit}`} target="_blank" rel="noopener">
            {row.commit}
          </Link>
        );
      },
    },
    { title: 'Branch', field: 'branch' },
    { title: 'Author', field: 'author.name' },
    { 
      title: 'Created', 
      render: (row: DeploymentParams) => formatDate(row.createdAt, false)
    },
  ];

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Table
      title="Deployments"
      options={{ search: true, paging: true, pageSize: 10 }}
      columns={columns}
      data={value?.deployments || []}
    />
  );
};
