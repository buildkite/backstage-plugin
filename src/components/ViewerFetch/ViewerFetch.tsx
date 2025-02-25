import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef, User } from '../../api';
import {
  Progress,
  Table,
  TableColumn,
  ErrorPanel,
} from '@backstage/core-components';
import { Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(1),
  },
}));

const columns: TableColumn[] = [
  { title: 'Field', field: 'field' },
  { title: 'Value', field: 'value' },
];

export const ViewerFetch = () => {
  const classes = useStyles();
  const buildkiteAPI = useApi(buildkiteAPIRef);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await buildkiteAPI.getUser();
        setUserData(user);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(
          err instanceof Error ? err : new Error('An unknown error occurred'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [buildkiteAPI]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (!userData) {
    return <Typography>No user data available</Typography>;
  }

  const tableData = [
    { field: 'ID', value: userData.id },
    { field: 'Name', value: userData.name },
    { field: 'Email', value: userData.email },
    {
      field: 'Created At',
      value: new Date(userData.created_at).toLocaleString(),
    },
    { field: 'GraphQL ID', value: userData.graphql_id },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Buildkite User Information</Typography>
      </Grid>
      <Grid item container xs={12} alignItems="center">
        <img
          src={userData.avatar_url}
          alt="User Avatar"
          className={classes.avatar}
        />
        <Typography variant="h6">{userData.name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Table
          options={{ search: false, paging: false }}
          columns={columns}
          data={tableData}
        />
      </Grid>
    </Grid>
  );
};
