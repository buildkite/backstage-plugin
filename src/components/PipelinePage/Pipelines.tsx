import React, { useState, useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  Paper,
  Typography,
  Link,
  CircularProgress,
} from '@material-ui/core';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { Navatar } from '../Navatar';
import { BuildParams, PipelineParams } from '../Types';
import { BuildRow } from '../BuildComponent/BuildComponent';
import { BranchIcon } from '../Icons';
import { buildkiteAPIRef } from '../../api/BuildkiteAPI';

interface BuildsByBranch {
  [branch: string]: BuildParams[];
}

const groupBuildsByBranch = (builds: BuildParams[]): BuildsByBranch => {
  return builds.reduce((acc: BuildsByBranch, build: BuildParams) => {
    if (!acc[build.branch]) {
      acc[build.branch] = [];
    }
    acc[build.branch].push(build);
    return acc;
  }, {});
};

const Pipeline: React.FC<{ pipeline: PipelineParams }> = ({ pipeline }) => {
  const [isUTC, setIsUTC] = useState(false);
  const [expanded, setExpanded] = useState<{ [branch: string]: boolean[] }>({});

  useEffect(() => {
    const buildsByBranch = groupBuildsByBranch(pipeline.builds);
    setExpanded(
      Object.fromEntries(
        Object.keys(buildsByBranch).map((branch) => [
          branch,
          new Array(buildsByBranch[branch].length).fill(false),
        ]),
      ),
    );
  }, [pipeline.builds]);

  const handleExpandClick = (branch: string, index: number) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [branch]: prevExpanded[branch].map((value, i) =>
        i === index ? !value : value,
      ),
    }));
  };

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  const buildsByBranch = groupBuildsByBranch(pipeline.builds);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          <Typography variant="h5" style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
            Home
          </Typography>
        </Link>
        <Box display="flex" flexDirection="row" gridGap="8px" alignItems="center">
          <Navatar color={pipeline.navatarColor} image={pipeline.navatarImage} />
          <Typography
            variant="h5"
            color="textPrimary"
            style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}
          >
            {pipeline.name}
          </Typography>
        </Box>
      </Breadcrumbs>
      <Box display="flex" flexDirection="column" gridGap="30px" marginTop="20px">
        {Object.entries(buildsByBranch).map(([branch, builds]) => (
          <Paper key={branch} variant="outlined" style={{ overflow: 'hidden' }}>
            <Box
              display="flex"
              flexDirection="row"
              gridGap="4px"
              alignItems="center"
              bgcolor="#F8F8F8"
              borderBottom="1px solid #E5E5E5"
              padding="8px"
            >
              <BranchIcon style={{ color: 'grey', fontSize: '14px' }} />
              <Typography
                variant="h5"
                style={{
                  fontSize: '13px',
                  color: '#737373',
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {branch}
              </Typography>
            </Box>
            {builds.map((build, index) => (
              <BuildRow
                key={build.buildNumber}
                build={build}
                pipeline={pipeline}
                index={index}
                expanded={expanded[branch]?.[index] || false}
                onExpandClick={() => handleExpandClick(branch, index)}
                isUTC={isUTC}
                onTimeClick={handleTimeClick}
              />
            ))}
          </Paper>
        ))}
      </Box>
    </>
  );
};

interface PipelinePageProps {
  orgSlug: string;
  pipelineSlug: string;
}

export const PipelinePage: React.FC<PipelinePageProps> = ({ orgSlug, pipelineSlug }) => {
  const [pipeline, setPipeline] = useState<PipelineParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const buildkiteApi = useApi(buildkiteAPIRef);
  const errorApi = useApi(errorApiRef);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setLoading(true);
        const fetchedPipeline = await buildkiteApi.getPipeline(orgSlug, pipelineSlug);
        setPipeline(fetchedPipeline);
      } catch (err) {
        setError(err as Error);
        errorApi.post(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPipeline();
  }, [orgSlug, pipelineSlug, buildkiteApi, errorApi]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!pipeline) {
    return <Typography>Pipeline not found</Typography>;
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Pipeline pipeline={pipeline} />
      </Grid>
    </Grid>
  );
};
