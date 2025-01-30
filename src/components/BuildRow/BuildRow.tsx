import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Typography,
  Collapse,
  Tooltip,
  Link,
  Avatar,
} from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { BuildStep } from '../BuildStepComponent';
import { BranchIcon, GithubIcon, StatusIcon } from '../Icons';
import { makeStyles } from '@material-ui/core/styles';
import { BuildParams } from '../Types';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import {
  getBuildkiteProjectSlug,
  parseBuildkiteProjectSlug,
} from '../../utils';

const useStyles = makeStyles({
  chip: {
    color: '#737373',
    border: 'none',
    borderRadius: '4px',
    margin: 0,
  },
  buildBox: {
    '&:not(:last-child)': {
      borderBottom: '1px solid #E5E5E5',
    },
  },
  actionsContainer: {
    display: 'flex',
    gap: '4px',
    marginLeft: 'auto',
  },
  retryButton: {
    width: '32px',
    height: '32px',
    '&:disabled': {
      opacity: 0.5,
    },
  },
});

export interface BuildRowProps {
  build: BuildParams;
  index: number;
  expanded: boolean;
  onExpandClick: () => void;
  isUTC: boolean;
  onTimeClick: () => void;
}

export const BuildRow: React.FC<BuildRowProps> = ({
  build,
  expanded,
  onExpandClick,
  isUTC,
  onTimeClick,
}) => {
  const classes = useStyles();
  const { entity } = useEntity();
  const buildkiteApi = useApi(buildkiteAPIRef);
  const [isRebuilding, setIsRebuilding] = useState(false);

  const handleRebuild = async () => {
    try {
      setIsRebuilding(true);
      const projectSlug = getBuildkiteProjectSlug(entity);
      const { organizationSlug, pipelineSlug } =
        parseBuildkiteProjectSlug(projectSlug);

      await buildkiteApi.rebuildBuild(
        organizationSlug,
        pipelineSlug,
        build.buildNumber,
      );

      await buildkiteApi.getPipeline(organizationSlug, pipelineSlug);
    } catch (error) {
      console.error('Failed to rebuild:', error);
    } finally {
      setIsRebuilding(false);
    }
  };

  if (!build) {
    return null;
  }

  const {
    status,
    buildMessage,
    buildNumber,
    author,
    branch,
    commitId,
    createdAt,
    timeElapsed,
    steps = [],
  } = build;

  const formatDate = (dateString: string, toUTC: boolean) => {
    const date = new Date(dateString);
    if (toUTC) {
      const day = date.toUTCString().slice(0, 3);
      const dayOfMonth = date.getUTCDate();
      const month = date.toUTCString().slice(8, 11);
      const year = date.getUTCFullYear();
      const time = date.toUTCString().slice(17, 22);
      return `Created ${day} ${dayOfMonth}th ${month} ${year} at ${time} UTC`;
    } else {
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const time = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return isToday
        ? `Created today at ${time}`
        : `Created on ${date.toLocaleDateString()} at ${time}`;
    }
  };

  return (
    <Box className={classes.buildBox}>
      <Box display="flex" padding="12px" gridGap="12px">
        <Box
          display="flex"
          flexDirection="column"
          gridGap="6px"
          alignItems="center"
        >
          <StatusIcon status={status} size="small" />
          <Typography
            variant="caption"
            style={{ color: '#737373', paddingTop: '1px' }}
          >
            {timeElapsed}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gridGap="4px">
          <Box
            display="flex"
            paddingLeft="4px"
            gridGap="6px"
            alignItems="center"
          >
            <Link
              color="textPrimary"
              href="#"
              onClick={e => e.preventDefault()}
            >
              <Typography variant="subtitle2">
                <strong>{buildMessage}</strong>
              </Typography>
            </Link>
            <Typography
              variant="caption"
              style={{ color: '#737373', paddingTop: '3px' }}
            >
              #{buildNumber}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" margin={0} gridGap="3px">
            <Chip
              className={classes.chip}
              avatar={<Avatar src={author?.avatar} />}
              label={author?.name || 'Unknown'}
              variant="outlined"
              size="small"
            />
            <Typography style={{ color: '#111111', fontSize: '12px' }}>
              ·
            </Typography>
            <Chip
              className={classes.chip}
              style={{ paddingLeft: '4px' }}
              icon={<BranchIcon />}
              label={branch}
              variant="outlined"
              size="small"
            />
            <Typography variant="caption">/</Typography>
            <Chip
              className={classes.chip}
              style={{ paddingLeft: '4px' }}
              icon={<GithubIcon />}
              label={commitId}
              variant="outlined"
              size="small"
            />
            <Typography style={{ color: '#111111', fontSize: '12px' }}>
              ·
            </Typography>
            <Tooltip
              title="Click to toggle between local and UTC"
              placement="top"
            >
              <Chip
                className={classes.chip}
                label={formatDate(createdAt, isUTC)}
                variant="outlined"
                size="small"
                onClick={onTimeClick}
              />
            </Tooltip>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ marginLeft: 'auto', borderRadius: '4px' }}
        >
          <UnfoldMoreIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box className={classes.actionsContainer}>
        <Tooltip title="Retry build">
          <IconButton
            size="small"
            onClick={handleRebuild}
            disabled={isRebuilding}
            className={classes.retryButton}
          >
            <ReplayIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconButton
          size="small"
          onClick={onExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ borderRadius: '4px' }}
        >
          <UnfoldMoreIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          display="flex"
          gridGap="4px"
          alignItems="center"
          flexWrap="wrap"
          bgcolor="#f8f8f8"
          padding="12px"
          boxShadow="inset 0px 1px 4px rgba(0, 0, 0, 0.1)"
        >
          {steps?.map(step => <BuildStep key={step.id} step={step} />)}
        </Box>
      </Collapse>
    </Box>
  );
};
