import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Paper,
  Typography,
  lighten,
  makeStyles,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { PipelineParams, BuildParams, Navatar, BuildRow, TriggerBuildButton } from '..';
import { PipelineFilters } from '../Filters';

const useStyles = makeStyles(theme => ({
  branchHeader: {
    padding: '8px 12px',
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: lighten(theme.palette.background.default, 0.1),
    },
  },
  branchSection: {
    marginBottom: '20px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  filter: {
    minWidth: '200px',
  },
  branchFilter: {
    minWidth: '200px',
  },
  branchCount: {
    fontSize: '12px',
    color: theme.palette.text.secondary,
    marginLeft: '8px',
  },
  expandButton: {
    textTransform: 'none',
    minWidth: '40px',
    width: '40px',
    height: '40px',
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  },
}));

interface GroupedBuilds {
  main: BuildParams[];
  other: { [branch: string]: BuildParams[] };
}

const groupBuildsByBranch = (builds: BuildParams[]): GroupedBuilds => {
  const sortedBuilds = [...builds].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return sortedBuilds.reduce(
    (acc, build) => {
      if (build.branch === 'main' || build.branch === 'master') {
        acc.main.push(build);
      } else {
        if (!acc.other[build.branch]) {
          acc.other[build.branch] = [];
        }
        acc.other[build.branch].push(build);
      }
      return acc;
    },
    { main: [], other: {} } as GroupedBuilds,
  );
};

const sortBranches = (groupedBuilds: GroupedBuilds): string[] => {
  return Object.entries(groupedBuilds.other)
    .sort(([, buildsA], [, buildsB]) => {
      const latestA = Math.max(
        ...buildsA.map(b => new Date(b.createdAt).getTime()),
      );
      const latestB = Math.max(
        ...buildsB.map(b => new Date(b.createdAt).getTime()),
      );
      return latestB - latestA;
    })
    .map(([branch]) => branch);
};

interface PipelineViewProps {
  pipeline: PipelineParams;
  onRefresh?: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ pipeline, onRefresh }) => {
  const {
    name = 'Pipeline',
    navatarColor = '#D1FAFF',
    navatarImage = 'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
  } = pipeline;

  const classes = useStyles();
  const [isUTC, setIsUTC] = useState(false);
  const [expandedBuilds, setExpandedBuilds] = useState<{
    [key: string]: boolean;
  }>({});
  const [collapsedBranches, setCollapsedBranches] = useState<{
    [key: string]: boolean;
  }>({});
  const [filteredBuilds, setFilteredBuilds] = useState<BuildParams[]>(
    pipeline.builds,
  );

  // Keep track of the latest pipeline builds reference
  const latestPipelineBuildsRef = useRef(pipeline.builds);

  // Keep track of the most recent filter operation
  const lastFilterOperationRef =
    useRef<(builds: BuildParams[]) => BuildParams[]>();

  // Update filtered builds when pipeline changes while preserving filters
  useEffect(() => {
    if (pipeline.builds !== latestPipelineBuildsRef.current) {
      latestPipelineBuildsRef.current = pipeline.builds;

      if (lastFilterOperationRef.current) {
        const newFilteredBuilds = lastFilterOperationRef.current(
          pipeline.builds,
        );
        setFilteredBuilds(newFilteredBuilds);
      } else {
        setFilteredBuilds(pipeline.builds);
      }
    }
  }, [pipeline.builds]);

  // Auto-expand running builds
  useEffect(() => {
    const newExpandedState = { ...expandedBuilds };
    let hasChanges = false;

    pipeline.builds.forEach(build => {
      if (build.status === 'RUNNING' && !expandedBuilds[build.buildNumber]) {
        newExpandedState[build.buildNumber] = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setExpandedBuilds(newExpandedState);
    }
  }, [pipeline.builds, expandedBuilds]);

  const handleFilteredBuildsChange = (
    newFilteredBuilds: BuildParams[],
    filterOperation: (builds: BuildParams[]) => BuildParams[],
  ) => {
    setFilteredBuilds(newFilteredBuilds);
    lastFilterOperationRef.current = filterOperation;
  };

  const allExpanded = useMemo(() => {
    return filteredBuilds.every(build => expandedBuilds[build.buildNumber]);
  }, [expandedBuilds, filteredBuilds]);

  const toggleAllBuilds = () => {
    const newExpandedState = !allExpanded;
    const updatedExpanded = filteredBuilds.reduce(
      (acc, build) => ({
        ...acc,
        [build.buildNumber]: newExpandedState,
      }),
      {},
    );
    setExpandedBuilds(updatedExpanded);
  };

  if (!pipeline?.builds) {
    console.error('Invalid pipeline data:', pipeline);
    return <Typography>Invalid pipeline data</Typography>;
  }

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  const handleExpandClick = (buildNumber: string) => {
    setExpandedBuilds(prev => ({
      ...prev,
      [buildNumber]: !prev[buildNumber],
    }));
  };

  const toggleBranchCollapse = (branch: string) => {
    setCollapsedBranches(prev => ({
      ...prev,
      [branch]: !prev[branch],
    }));
  };

  const renderBuilds = (builds: BuildParams[]) => {
    return builds.map((build, index) => (
      <BuildRow
        key={build.buildNumber}
        build={build}
        index={index}
        pipeline={pipeline}
        expanded={expandedBuilds[build.buildNumber] || false}
        onExpandClick={() => handleExpandClick(build.buildNumber)}
        isUTC={isUTC}
        onTimeClick={handleTimeClick}
      />
    ));
  };

  const renderBranchSection = (branch: string, builds: BuildParams[]) => {
    if (builds.length === 0) {
      return null;
    }

    const isCollapsed = collapsedBranches[branch];

    return (
      <Box key={branch}>
        <Box
          className={classes.branchHeader}
          onClick={() => toggleBranchCollapse(branch)}
        >
          <Box display="flex" alignItems="center">
            {branch}
            <span className={classes.branchCount}>
              ({builds.length} builds)
            </span>
          </Box>
          {isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </Box>
        {!isCollapsed && renderBuilds(builds)}
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" gridGap="20px">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          <Typography
            variant="h5"
            style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}
          >
            Home
          </Typography>
        </Link>
        <Box
          display="flex"
          flexDirection="row"
          gridGap="8px"
          alignItems="center"
        >
          <Navatar color={navatarColor} image={navatarImage} />
          <Typography
            variant="h5"
            color="textPrimary"
            style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}
          >
            {name}
          </Typography>
        </Box>
      </Breadcrumbs>

      {/* Two-column layout for filters and builds */}
      <Grid container spacing={3}>
        {/* Left column - Filters and actions */}
        <Grid item xs={12} sm={12} md={3} lg={2}>
          {/* Action button in filters column */}
          <Paper variant="outlined" style={{ padding: '12px', marginBottom: '16px' }}>
            <Typography variant="subtitle2" gutterBottom>Actions</Typography>
            <Box>
              <TriggerBuildButton 
                defaultBranch="main"
                variant="contained"
                size="small"
                text="New Build"
                onBuildTriggered={() => {
                  // Refresh the pipeline data when a build is triggered
                  if (onRefresh) {
                    onRefresh();
                  }
                }}
              />
            </Box>
          </Paper>
          
          {/* Filters panel */}
          <Paper variant="outlined" style={{ padding: '12px', marginBottom: '16px' }}>
            <Typography variant="subtitle2" gutterBottom>Filters</Typography>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="stretch"
              style={{ gap: '8px' }}
            >
              <PipelineFilters
                builds={pipeline.builds}
                onFilteredBuildsChange={handleFilteredBuildsChange}
                allExpanded={allExpanded}
                onToggleAllBuilds={toggleAllBuilds}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Builds list */}
        <Grid item xs={12} sm={12} md={9} lg={10}>
          {/* Builds header with Expand/Collapse button */}
          <Paper variant="outlined" style={{ padding: '12px', marginBottom: '16px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Builds</Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={allExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                onClick={toggleAllBuilds}
              >
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </Button>
            </Box>
          </Paper>
          
          <Paper variant="outlined">
            {(() => {
              const groupedBuilds = groupBuildsByBranch(filteredBuilds);
              return (
                <>
                  {renderBranchSection('main', groupedBuilds.main)}
                  {sortBranches(groupedBuilds).map(branch =>
                    renderBranchSection(branch, groupedBuilds.other[branch]),
                  )}
                </>
              );
            })()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PipelineView;
