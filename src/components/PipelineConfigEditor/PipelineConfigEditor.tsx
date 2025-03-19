import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useBuildkiteApi, usePipelineConfig } from '../../hooks/useBuildkiteApi';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  editorContainer: {
    width: '100%',
    minHeight: '60vh',
  },
  editor: {
    fontFamily: 'monospace',
    width: '100%',
    minHeight: '60vh',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  editButton: {
    marginLeft: theme.spacing(1),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

type PipelineConfigEditorProps = {
  orgSlug: string;
  pipelineSlug: string;
};

export const PipelineConfigEditor: React.FC<PipelineConfigEditorProps> = ({
  orgSlug,
  pipelineSlug,
}) => {
  const classes = useStyles();
  const api = useBuildkiteApi();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState('');
  const [originalConfig, setOriginalConfig] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const pipelineConfig = await api.getPipelineConfig(orgSlug, pipelineSlug);
      setConfig(pipelineConfig);
      setOriginalConfig(pipelineConfig);
    } catch (err) {
      setError(`Failed to load pipeline configuration: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setConfig('');
    setOriginalConfig('');
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.updatePipelineConfig(orgSlug, pipelineSlug, config);
      setSuccess('Pipeline configuration updated successfully!');
      setOriginalConfig(config);
      setOpen(false);
    } catch (err) {
      setError(`Failed to update pipeline configuration: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(event.target.value);
  };

  const isConfigModified = config !== originalConfig;

  return (
    <div className={classes.root}>
      <div className={classes.buttonWrapper}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpen}
          startIcon={<EditIcon />}
          className={classes.editButton}
        >
          Edit Pipeline Configuration
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <div className={classes.title}>
            <Typography variant="h6">
              Edit Pipeline Configuration
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {loading && (
            <div className={classes.loadingOverlay}>
              <CircularProgress />
            </div>
          )}
          {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
          <div className={classes.editorContainer}>
            <TextField
              label="Pipeline Configuration (YAML)"
              value={config}
              onChange={handleChange}
              multiline
              variant="outlined"
              fullWidth
              className={classes.editor}
              InputProps={{ style: { fontFamily: 'monospace' } }}
              disabled={loading}
              error={!!error}
              placeholder="Loading pipeline configuration..."
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={loading || !isConfigModified}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};