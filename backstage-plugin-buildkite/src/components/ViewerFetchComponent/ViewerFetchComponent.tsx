import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { Progress, Table, TableColumn } from '@backstage/core-components';

type ViewerData = {
  id: string;
};

const columns: TableColumn[] = [
  {
    title: 'Viewer ID',
    field: 'id',
  },
];

export const ViewerFetchComponent = () => {
  const buildkiteAPI = useApi(buildkiteAPIRef);
  const [viewerData, setViewerData] = useState<ViewerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchViewerId = async () => {
      try {
        const viewerId = await buildkiteAPI.getViewerId();
        console.log('Viewer ID:', viewerId);
        setViewerData({ id: viewerId });
      } catch (err) {
        console.error('Error fetching viewer ID:', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchViewerId();
  }, [buildkiteAPI]);
  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Table
      title="Buildkite Viewer Information"
      options={{ search: false, paging: false }}
      columns={columns}
      data={viewerData ? [viewerData] : []}
    />
  );
};
