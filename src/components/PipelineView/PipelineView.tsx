import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
} from '@material-ui/core';
import { BuildRow } from '../BuildComponent';
import { Navatar } from '../Navatar';
import { PipelineParams } from '../Types';

interface PipelineViewProps {
  pipeline: PipelineParams;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ pipeline }) => {
  const [isUTC, setIsUTC] = useState(false);
  const [expandedBuilds, setExpandedBuilds] = useState<{ [key: string]: boolean }>({});

  console.log('PipelineView received pipeline:', pipeline);

  // Guard against invalid pipeline data
  if (!pipeline?.builds) {
    console.error('Invalid pipeline data:', pipeline);
    return <Typography>Invalid pipeline data</Typography>;
  }

  const {
    name = 'Pipeline',
    navatarColor = '#D1FAFF',
    navatarImage = 'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
    builds = [],
  } = pipeline;

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  const handleExpandClick = (buildNumber: string) => {
    setExpandedBuilds(prev => ({
      ...prev,
      [buildNumber]: !prev[buildNumber]
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gridGap="20px">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          <Typography variant="h5" style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
            Home
          </Typography>
        </Link>
        <Box display="flex" flexDirection="row" gridGap="8px" alignItems="center">
          <Navatar 
            color={navatarColor} 
            image={navatarImage} 
          />
          <Typography
            variant="h5"
            color="textPrimary"
            style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}
          >
            {name}
          </Typography>
        </Box>
      </Breadcrumbs>
      
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Paper variant="outlined">
            {builds.map((build, index) => {
              console.log('Rendering build:', build);
              
              if (!build?.buildNumber) {
                console.warn('Invalid build data at index:', index);
                return null;
              }

              return (
                <BuildRow
                  key={build.buildNumber}
                  build={build}
                  pipeline={pipeline}
                  index={index}
                  expanded={expandedBuilds[build.buildNumber] || false}
                  onExpandClick={() => handleExpandClick(build.buildNumber)}
                  isUTC={isUTC}
                  onTimeClick={handleTimeClick}
                />
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
