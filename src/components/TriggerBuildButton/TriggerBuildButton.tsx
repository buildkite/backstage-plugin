import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import { BuildTriggerOptions } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { buildkiteAPIRef } from '../../api';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  paramRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
  envSection: {
    marginTop: theme.spacing(2),
  },
  metadataSection: {
    marginTop: theme.spacing(2),
  },
  envTitle: {
    marginBottom: theme.spacing(1),
  },
  envParams: {
    marginLeft: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(1),
  },
  switchLabel: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  commit: {
    fontFamily: 'monospace',
  },
  formControl: {
    minWidth: 120,
  },
}));

interface EnvParam {
  key: string;
  value: string;
}

interface MetadataParam {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean';
}

interface TriggerBuildButtonProps {
  /** Optional default branch to use */
  defaultBranch?: string;
  /** Optional list of available branches */
  branches?: string[];
  /** Button variant */
  variant?: 'text' | 'outlined' | 'contained';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Button text */
  text?: string;
  /** Whether to show button text */
  showText?: boolean;
  /** Whether to include the current user's details as the author */
  includeCurrentUser?: boolean;
  /** Callback for after a build is triggered */
  onBuildTriggered?: () => void;
  /** Organization slug */
  orgSlug: string;
  /** Pipeline slug */
  pipelineSlug: string;
}

export const TriggerBuildButton = ({
  defaultBranch = 'main',
  branches = [],
  variant = 'contained',
  size = 'small',
  text = 'Trigger Build',
  showText = true,
  includeCurrentUser = true,
  onBuildTriggered,
  orgSlug,
  pipelineSlug,
}: TriggerBuildButtonProps) => {
  const classes = useStyles();
  const buildkiteApi = useApi(buildkiteAPIRef);

  // Form state
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState(defaultBranch);
  const [commit, setCommit] = useState('HEAD');
  const [message, setMessage] = useState('Triggered from Backstage');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [includeAuthor, setIncludeAuthor] = useState(includeCurrentUser);
  const [envParams, setEnvParams] = useState<EnvParam[]>([]);
  const [metadataParams, setMetadataParams] = useState<MetadataParam[]>([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addEnvParam = () => {
    setEnvParams([...envParams, { key: '', value: '' }]);
  };

  const updateEnvParam = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newParams = [...envParams];
    newParams[index][field] = value;
    setEnvParams(newParams);
  };

  const removeEnvParam = (index: number) => {
    setEnvParams(envParams.filter((_, i) => i !== index));
  };

  const addMetadataParam = () => {
    setMetadataParams([
      ...metadataParams,
      { key: '', value: '', valueType: 'string' },
    ]);
  };

  const updateMetadataParam = (
    index: number,
    field: 'key' | 'value' | 'valueType',
    value: string,
  ) => {
    const newParams = [...metadataParams];
    if (field === 'valueType') {
      newParams[index][field] = value as 'string' | 'number' | 'boolean';
    } else {
      newParams[index][field] = value;
    }
    setMetadataParams(newParams);
  };

  const removeMetadataParam = (index: number) => {
    setMetadataParams(metadataParams.filter((_, i) => i !== index));
  };

  const parseMetadataValue = (param: MetadataParam) => {
    if (param.valueType === 'boolean') {
      return param.value.toLowerCase() === 'true';
    }
    if (param.valueType === 'number') {
      return Number(param.value);
    }
    return param.value;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Build options for the API call
      const options: BuildTriggerOptions = {
        branch,
        message,
      };

      if (commit) {
        options.commit = commit;
      }

      if (includeAuthor && authorName && authorEmail) {
        options.author = {
          name: authorName,
          email: authorEmail,
        };
      }

      // Add environment variables if any
      if (envParams.length > 0) {
        const env: Record<string, string> = {};
        envParams.forEach(param => {
          if (param.key) {
            env[param.key] = param.value;
          }
        });
        options.env = env;
      }

      // Add metadata if any
      if (metadataParams.length > 0) {
        const metadata: Record<string, any> = {};
        metadataParams.forEach(param => {
          if (param.key) {
            metadata[param.key] = parseMetadataValue(param);
          }
        });
        options.meta_data = metadata;
      }

      // Trigger the build via the API using the provided org and pipeline slugs
      await buildkiteApi.triggerBuild(orgSlug, pipelineSlug, options);

      // Close dialog and call callback if provided
      handleClose();
      if (onBuildTriggered) {
        onBuildTriggered();
      }
    } catch (error) {
      console.error('Error triggering build:', error);
      alert(
        `Failed to trigger build: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user on mount for author details if needed
  React.useEffect(() => {
    if (includeCurrentUser) {
      const fetchUser = async () => {
        try {
          const user = await buildkiteApi.getUser();
          setAuthorName(user.name);
          setAuthorEmail(user.email);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }
  }, [buildkiteApi, includeCurrentUser]);

  return (
    <>
      <Tooltip title="Trigger a new build">
        <Button
          variant={variant}
          size={size}
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleOpen}
        >
          {showText ? text : ''}
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Trigger New Build</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} className={classes.form}>
              {/* Basic build options */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="branch-select-label">Branch</InputLabel>
                      <Select
                        labelId="branch-select-label"
                        id="branch-select"
                        value={branch}
                        onChange={e => setBranch(e.target.value as string)}
                        label="Branch"
                        required
                      >
                        {branches.length > 0 ? (
                          branches.map(b => (
                            <MenuItem key={b} value={b}>
                              {b}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value={defaultBranch}>
                            {defaultBranch}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="commit"
                      label="Commit SHA (optional)"
                      variant="outlined"
                      fullWidth
                      value={commit}
                      onChange={e => setCommit(e.target.value)}
                      className={classes.commit}
                      placeholder="abcd0b72a1e580e90712cdd9eb26d3fb41cd09c8"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="message"
                  label="Build Message"
                  variant="outlined"
                  fullWidth
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </Grid>

              {/* Author section */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className={classes.switchLabel}>
                      <Switch
                        checked={includeAuthor}
                        onChange={e => setIncludeAuthor(e.target.checked)}
                        color="primary"
                      />
                      <span>Include Author Information</span>
                    </div>
                  </Grid>

                  {includeAuthor && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          id="author-name"
                          label="Author Name"
                          variant="outlined"
                          fullWidth
                          value={authorName}
                          onChange={e => setAuthorName(e.target.value)}
                          required={includeAuthor}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          id="author-email"
                          label="Author Email"
                          variant="outlined"
                          fullWidth
                          value={authorEmail}
                          onChange={e => setAuthorEmail(e.target.value)}
                          required={includeAuthor}
                          type="email"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              {/* Environment Variables */}
              <Grid item xs={12} className={classes.envSection}>
                <h3 className={classes.envTitle}>Environment Variables</h3>
                <div className={classes.envParams}>
                  {envParams.map((param, index) => (
                    <div key={index} className={classes.paramRow}>
                      <TextField
                        label="Variable Name"
                        variant="outlined"
                        value={param.key}
                        onChange={e =>
                          updateEnvParam(index, 'key', e.target.value)
                        }
                        required
                      />
                      <TextField
                        label="Value"
                        variant="outlined"
                        value={param.value}
                        onChange={e =>
                          updateEnvParam(index, 'value', e.target.value)
                        }
                        fullWidth
                      />
                      <IconButton
                        onClick={() => removeEnvParam(index)}
                        className={classes.deleteIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={addEnvParam}
                    className={classes.addButton}
                  >
                    Add Environment Variable
                  </Button>
                </div>
              </Grid>

              {/* Metadata */}
              <Grid item xs={12} className={classes.metadataSection}>
                <h3 className={classes.envTitle}>Build Metadata</h3>
                <div className={classes.envParams}>
                  {metadataParams.map((param, index) => (
                    <div key={index} className={classes.paramRow}>
                      <TextField
                        label="Key"
                        variant="outlined"
                        value={param.key}
                        onChange={e =>
                          updateMetadataParam(index, 'key', e.target.value)
                        }
                        required
                      />
                      <TextField
                        label="Value"
                        variant="outlined"
                        value={param.value}
                        onChange={e =>
                          updateMetadataParam(index, 'value', e.target.value)
                        }
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <FormControl
                                variant="outlined"
                                className={classes.formControl}
                                size="small"
                              >
                                <Select
                                  value={param.valueType}
                                  onChange={e =>
                                    updateMetadataParam(
                                      index,
                                      'valueType',
                                      e.target.value as string,
                                    )
                                  }
                                >
                                  <MenuItem value="string">String</MenuItem>
                                  <MenuItem value="number">Number</MenuItem>
                                  <MenuItem value="boolean">Boolean</MenuItem>
                                </Select>
                                <FormHelperText>Type</FormHelperText>
                              </FormControl>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <IconButton
                        onClick={() => removeMetadataParam(index)}
                        className={classes.deleteIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={addMetadataParam}
                    className={classes.addButton}
                  >
                    Add Metadata
                  </Button>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Triggering...' : 'Trigger Build'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
