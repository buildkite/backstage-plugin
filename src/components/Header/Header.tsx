import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { Progress } from '@backstage/core-components';
import {
  Avatar,
  Box,
  makeStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(theme => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  userName: {
    fontWeight: 500,
  },
  leftContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

interface BuildkiteHeaderProps {
  title?: string;
  subtitle?: string;
}

export const BuildkiteHeader: React.FC<BuildkiteHeaderProps> = ({
  title = 'Buildkite CI',
  subtitle,
}) => {
  const classes = useStyles();
  const buildkiteApi = useApi(buildkiteAPIRef);

  const { value: user, loading: userLoading } = useAsync(async () => {
    return await buildkiteApi.getUser();
  }, []);

  return (
    <Box className={classes.headerContainer}>
      <Box className={classes.leftContent}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="subtitle2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {userLoading ? (
        <Progress style={{ width: '100px' }} />
      ) : (
        user && (
          <Box className={classes.userInfo}>
            <Tooltip title={`Signed in as ${user.email}`}>
              <Avatar
                src={user.avatar_url}
                alt={user.name}
                className={classes.avatar}
                imgProps={{
                  onError: (
                    e: React.SyntheticEvent<HTMLImageElement, Event>,
                  ) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                  },
                }}
              />
            </Tooltip>
            <Typography variant="subtitle2" className={classes.userName}>
              {user.name}
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
};
