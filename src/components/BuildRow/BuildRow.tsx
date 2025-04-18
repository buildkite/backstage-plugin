import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Link,
  IconButton,
  Collapse,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReplayIcon from '@material-ui/icons/Replay';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import { BranchIcon, GithubIcon, StatusIcon } from '../Icons';
import { BuildStep } from '../BuildStep/BuildStep';
import { BuildParams, PipelineParams } from '../types/buildkiteTypes';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  getBuildkiteProjectSlug,
  parseBuildkiteProjectSlug,
  getBuildkiteUrl,
} from '../../utils';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { TimeChip } from '../TimeChip';

const useStyles = makeStyles(theme => ({
  buildRow: {
    backgroundColor: theme.palette.background.paper,
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  chip: {
    color: theme.palette.text.secondary,
    border: 'none',
    borderRadius: '4px',
    margin: 0,
  },
  branchChip: {
    color: theme.palette.text.primary,
    border: 'none',
    borderRadius: '4px',
    margin: 0,
    fontWeight: 500,
  },
  buildLink: {
    '&:hover': {
      textDecoration: 'none',
      '& .MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px',
    marginLeft: 'auto',
    flexDirection: 'row',
    minHeight: '40px',
  },
  collapseContainer: {
    display: 'flex',
    gridGap: '4px',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.default,
    padding: '12px',
  },
  retryButton: {
    width: '32px',
    height: '32px',
    '&:disabled': {
      opacity: 0.5,
    },
  },
}));

export type BuildRowProps = {
  build: BuildParams;
  pipeline: PipelineParams;
  index: number;
  expanded: boolean;
  onExpandClick: (index: number) => void;
  isUTC: boolean;
  onTimeClick: () => void;
};

export const BuildRow: React.FC<BuildRowProps> = ({
  build,
  index,
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
    } catch (error) {
      console.error('Failed to rebuild:', error);
    } finally {
      setIsRebuilding(false);
    }
  };

  // Get the organization and pipeline slugs from the entity annotation
  const projectSlug = getBuildkiteProjectSlug(entity);
  const { organizationSlug, pipelineSlug } =
    parseBuildkiteProjectSlug(projectSlug);

  // Construct Buildkite URL using the utility function
  const buildkiteUrl = getBuildkiteUrl(
    organizationSlug,
    pipelineSlug,
    build.buildNumber,
  );

  return (
    <Box className={classes.buildRow} key={build.buildNumber}>
      <Box
        display="flex"
        padding="12px"
        gridGap="12px"
        className={classes.buildRow}
      >
        <Box
          display="flex"
          flexDirection="column"
          gridGap="6px"
          alignItems="center"
        >
          <StatusIcon status={build.status} size="medium" />
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ paddingTop: '1px' }}
          >
            {build.timeElapsed}
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
              href={buildkiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.buildLink}
            >
              <Typography variant="subtitle2">
                <strong>{build.buildMessage}</strong>
              </Typography>
            </Link>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ paddingTop: '3px' }}
            >
              #{build.buildNumber}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            margin={0}
            gridGap="3px"
            color="textSecondary"
          >
            <Chip
              className={classes.chip}
              avatar={<Avatar src={build.author.avatar} />}
              label={build.author.name}
              variant="outlined"
              size="small"
            />
            <Typography color="textSecondary" style={{ fontSize: '12px' }}>
              ·
            </Typography>
            <Chip
              className={classes.branchChip}
              style={{ 
                paddingLeft: '4px', 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
              icon={build.branch.startsWith('gh-') ? 
                <GithubIcon viewBox="0 0 13 13" /> : 
                <BranchIcon size="small" />}
              label={build.branch}
              variant="outlined"
              size="small"
            />
            <Typography variant="caption">/</Typography>
            <Chip
              className={classes.chip}
              style={{ paddingLeft: '4px' }}
              icon={<GithubIcon viewBox="0 0 13 13" />}
              label={build.commitId}
              variant="outlined"
              size="small"
            />
            <Typography color="textSecondary" style={{ fontSize: '12px' }}>
              ·
            </Typography>
            <TimeChip
              dateString={build.createdAt}
              isUTC={isUTC}
              onTimeClick={onTimeClick}
            />
          </Box>
        </Box>
        <Box className={classes.actionsContainer}>
          <IconButton
            size="small"
            onClick={() => onExpandClick(index)}
            aria-expanded={expanded}
            aria-label="show more"
            style={{ marginLeft: 'auto', borderRadius: '4px' }}
          >
            {expanded ? (
              <UnfoldLessIcon fontSize="inherit" />
            ) : (
              <UnfoldMoreIcon fontSize="inherit" />
            )}
          </IconButton>
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
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box className={classes.collapseContainer}>
          {build.steps.map(step => (
            <BuildStep
              key={step.id}
              step={step}
              buildNumber={build.buildNumber}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
