import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { StatusIcon } from '../Icons';
import { Status } from '..';
import { processLogs } from './logProcessor';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '80vw',
    maxWidth: '90vw',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  content: {
    padding: 0,
    '&:first-child': {
      paddingTop: 0,
    },
  },
  logContainer: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: theme.spacing(2),
    fontFamily:
      'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
    fontSize: '12px',
    lineHeight: '1.5',
    height: '60vh',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  logLine: {
    margin: '2px 0',
    padding: '1px 4px',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'flex-start',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  timestamp: {
    color: '#6e7681',
    marginRight: theme.spacing(2),
    userSelect: 'none',
  },
  command: {
    color: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
  },
  warning: {
    color: '#d29922',
    backgroundColor: 'rgba(210, 153, 34, 0.1)',
  },
  error: {
    color: '#f85149',
    backgroundColor: 'rgba(248, 81, 73, 0.1)',
  },
  success: {
    color: '#3fb950',
    backgroundColor: 'rgba(63, 185, 80, 0.1)',
  },
  info: {
    color: '#8b949e',
    backgroundColor: 'rgba(139, 148, 158, 0.1)',
  },
  output: {
    color: '#c9d1d9',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  actions: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

interface JobLogViewerProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobUrl: string;
  status: Status;
  title: string;
  logs?: string[];
  loading?: boolean;
  error?: Error;
}

export const JobLogViewer: React.FC<JobLogViewerProps> = ({
  open,
  onClose,
  jobId,
  jobUrl,
  status,
  title,
  logs = [],
  loading = false,
  error,
}) => {
  const classes = useStyles();
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  const processedLogs = processLogs(logs);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      classes={{ paper: classes.root }}
    >
      <Box className={classes.header}>
        <Box className={classes.title}>
          <StatusIcon status={status} size="medium" />
          <Typography variant="h6">{title}</Typography>
          <Typography variant="caption" color="textSecondary">
            #{jobId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className={classes.content}>
        {loading && <LinearProgress />}

        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            className={classes.alert}
          >
            {error.message}
          </Alert>
        )}

        <Paper
          ref={logContainerRef}
          onScroll={handleScroll}
          className={classes.logContainer}
          elevation={0}
        >
          {processedLogs.map((line, index) => (
            <div
              key={index}
              className={`${classes.logLine} ${classes[line.type]}`}
            >
              {line.timestamp && (
                <span className={classes.timestamp}>{line.timestamp}</span>
              )}
              <span>{line.content}</span>
            </div>
          ))}
        </Paper>
      </DialogContent>

      <Box className={classes.actions}>
        <Button
          variant="outlined"
          onClick={() => setAutoScroll(!autoScroll)}
          color={autoScroll ? 'primary' : 'default'}
        >
          Auto-scroll {autoScroll ? 'On' : 'Off'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<OpenInNewIcon />}
          href={jobUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Buildkite
        </Button>
      </Box>
    </Dialog>
  );
};
