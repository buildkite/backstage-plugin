import React, { useState, useMemo } from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { BuildRow } from '../BuildComponent';
import { Navatar } from '../Navatar';
import { PipelineParams, BuildParams } from '../Types';
import { PipelineFilters } from '../Filters';

const useStyles = makeStyles({
  branchHeader: {
    padding: '8px 12px',
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #E5E5E5',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0',
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
    color: '#666',
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
});

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
}

export const PipelineView: React.FC<PipelineViewProps> = ({ pipeline }) => {
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

  const allExpanded = useMemo(() => {
    return pipeline.builds.every(build => expandedBuilds[build.buildNumber]);
  }, [expandedBuilds, pipeline.builds]);

  const toggleAllBuilds = () => {
    const newExpandedState = !allExpanded;
    const updatedExpanded = pipeline.builds.reduce(
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

  console.log('Pipeline data:', {
    totalBuilds: pipeline.builds.length,
    builds: pipeline.builds,
  });

  console.log('Grouped builds:', {
    main: groupBuildsByBranch(filteredBuilds).main.length,
    other: Object.keys(groupBuildsByBranch(filteredBuilds).other).length,
  });

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

      <Grid container spacing={3} direction="column">
        <Grid item>
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <PipelineFilters
              builds={pipeline.builds}
              onFilteredBuildsChange={setFilteredBuilds}
              allExpanded={allExpanded}
              onToggleAllBuilds={toggleAllBuilds}
            />
          </Box>

          <Paper variant="outlined">
            {renderBranchSection(
              'main',
              groupBuildsByBranch(filteredBuilds).main,
            )}
            {sortBranches(groupBuildsByBranch(filteredBuilds)).map(branch =>
              renderBranchSection(
                branch,
                groupBuildsByBranch(filteredBuilds).other[branch],
              ),
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PipelineView;
