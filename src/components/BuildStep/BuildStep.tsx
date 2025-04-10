import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  getBuildkiteProjectSlug,
  parseBuildkiteProjectSlug,
  isClickableStatus,
} from '../../utils';
import { Job } from '../Job/Job';
import { alpha, darken, lighten, makeStyles } from '@material-ui/core/styles';
import { BuildStepParams } from '../types/buildkiteTypes';
import { StatusIcon } from '../Icons';
import { Box, Chip } from '@material-ui/core';
import { useEmoji } from '../../hooks/useEmoji';

interface BuildStepProps {
  step: BuildStepParams;
  buildNumber: string;
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: '8px',
  },
  truncate: {
    maxWidth: '12em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusIcons: {
    display: 'flex',
    gridGap: '4px',
    alignItems: 'center',
    width: 'fit-content',
    minWidth: 'fit-content',
  },
  buildStep: {
    color: '#111111',
    borderRadius: '4px',
    margin: 0,
    minWidth: 0,
    borderColor: theme.palette.divider,
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
  },
  passed: {
    borderColor: alpha(theme.palette.success.light, 0.5),
    backgroundColor: alpha(theme.palette.success.light, 0.1),
    color:
      theme.palette.type === 'dark'
        ? lighten(theme.palette.success.light, 0.5)
        : darken(theme.palette.success.dark, 0.4),
    '&:hover:not(.notClickable)': {
      backgroundColor: alpha(theme.palette.success.main, 0.2),
    },
  },
  running: {
    borderColor: alpha(theme.palette.warning.light, 0.5),
    backgroundColor: alpha(theme.palette.warning.light, 0.2),
    color:
      theme.palette.type === 'dark'
        ? theme.palette.warning.light
        : darken(theme.palette.warning.dark, 0.4),
    '&:hover:not(.notClickable)': {
      backgroundColor: alpha(theme.palette.warning.main, 0.3),
    },
  },
  fail_soft: {
    borderColor: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color:
      theme.palette.type === 'dark'
        ? lighten(theme.palette.error.main, 0.2)
        : darken(theme.palette.error.dark, 0.4),
    '&:hover:not(.notClickable)': {
      backgroundColor: alpha(theme.palette.error.main, 0.2),
    },
  },
  fail: {
    borderColor: theme.palette.error.main,
    boxShadow: `inset 0 0 0 1px ${theme.palette.error.main}, inset 20px 0 0 0 ${theme.palette.error.main}`,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color:
      theme.palette.type === 'dark'
        ? lighten(theme.palette.error.main, 0.2)
        : darken(theme.palette.error.dark, 0.4),
    '&:hover:not(.notClickable)': {
      backgroundColor: alpha(theme.palette.error.main, 0.2),
    },
  },
  blocked: {
    color:
      theme.palette.type === 'dark' ? '#D1AFFF' : theme.palette.common.black,
    borderColor: '#4b19d5',
    boxShadow:
      theme.palette.type === 'dark'
        ? 'inset 0 0 0 1px #905cd6, inset -20px 0 0 0 #905cd6'
        : 'inset 0 0 0 1px #4b19d5, inset -20px 0 0 0 #4b19d5',
    backgroundColor: 'transparent',
    paddingRight: '3px',
    '&:hover:not(.notClickable)': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? alpha('#D1AFFF', 0.1)
          : alpha('#4b19d5', 0.1),
    },
  },
  unblocked: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.text.secondary
        : theme.palette.common.black,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  assigned: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.text.secondary
        : theme.palette.common.black,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  accepted: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.text.secondary
        : theme.palette.common.black,
    backgroundColor: 'transparent',
    borderStyle: 'dotted',
  },
  skipped: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.text.secondary
        : theme.palette.common.black,
    backgroundColor: 'transparent',
    textDecoration: 'line-through',
  },
  notClickable: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
}));

export const BuildStep: React.FC<BuildStepProps> = ({ step, buildNumber }) => {
  const classes = useStyles();
  const { entity } = useEntity();
  const buildkiteApi = useApi(buildkiteAPIRef);
  const { parse: parseEmoji } = useEmoji();

  const fetchLogs = async () => {
    try {
      const projectSlug = getBuildkiteProjectSlug(entity);
      const { organizationSlug, pipelineSlug } =
        parseBuildkiteProjectSlug(projectSlug);

      return await buildkiteApi.getJobLogs(
        organizationSlug,
        pipelineSlug,
        buildNumber,
        step.id,
      );
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  };

  const getStatusClass = (status: BuildStepParams['status']) => {
    switch (status) {
      case 'PASSED':
        return classes.passed;
      case 'FAILED':
        return classes.fail;
      case 'FAILING':
      case 'CANCELING':
        return classes.fail_soft;
      case 'RUNNING':
        return classes.running;
      case 'BLOCKED':
        return classes.blocked;
      case 'ASSIGNED':
        return classes.assigned;
      case 'ACCEPTED':
        return classes.accepted;
      case 'UNBLOCKED':
      case 'WAIT':
      case 'WAITER':
        return classes.unblocked;
      case 'SKIPPED':
        return classes.skipped;
      default:
        return '';
    }
  };

  if (!step.title) {
    return <StatusIcon status={step.status} size="small" />;
  }

  return (
    <Job
      step={step}
      onFetchLogs={fetchLogs}
      buildNumber={buildNumber}
      renderStep={({ onClick }) => (
        <Chip
          className={`${classes.buildStep} ${getStatusClass(step.status)} ${
            !isClickableStatus(step.status) ? classes.notClickable : ''
          }`}
          onClick={onClick}
          icon={
            <Box className={classes.statusIcons}>
              <StatusIcon
                status={step.status}
                size="small"
                color={step.status === 'FAILED' ? '#ffffff' : undefined}
              />
              {Array.isArray(step.icon) && step.icon.length > 0 ? (
                step.icon.map((iconSrc, index) => (
                  <img
                    key={index}
                    height="16"
                    width="16"
                    src={iconSrc}
                    alt={step.title}
                    className="emoji"
                  />
                ))
              ) : step.icon ? (
                <img
                  height="16"
                  width="16"
                  src={step.icon}
                  alt={step.title}
                  className="emoji"
                />
              ) : null}
            </Box>
          }
          label={
            <span
              dangerouslySetInnerHTML={{
                __html: parseEmoji(step.title || ''),
              }}
            />
          }
          variant="outlined"
          size="small"
          {...(step.status === 'BLOCKED' && {
            deleteIcon: (
              <StatusIcon status="CONTINUE" size="small" color="#FFF" />
            ),
            onDelete: () => console.info('You clicked the Chip.'),
          })}
        />
      )}
    />
  );
};

export default BuildStep;
