import React, { useState, useMemo } from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import { BuildRow } from '../BuildComponent';
import { Navatar } from '../Navatar';
import { PipelineParams, BuildParams } from '../Types';

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
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCreator, setSelectedCreator] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [collapsedBranches, setCollapsedBranches] = useState<{
    [key: string]: boolean;
  }>({});

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

  const groupedBuilds = groupBuildsByBranch(pipeline.builds);
  const sortedBranches = sortBranches(groupedBuilds);

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

  const filterOptions = useMemo(() => {
    const builds = pipeline.builds;

    const branchOptions = builds
      .filter(
        build =>
          selectedCreator === 'all' || build.author.name === selectedCreator,
      )
      .reduce((acc, build) => {
        const branch = build.branch;
        acc[branch] = (acc[branch] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const creatorOptions = builds
      .filter(
        build => selectedBranch === 'all' || build.branch === selectedBranch,
      )
      .reduce((acc, build) => {
        const creator = build.author.name;
        acc[creator] = (acc[creator] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const statusOptions = builds
      .filter(
        build =>
          (selectedBranch === 'all' || build.branch === selectedBranch) &&
          (selectedCreator === 'all' || build.author.name === selectedCreator),
      )
      .reduce((acc, build) => {
        const status = build.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      branches: branchOptions,
      creators: creatorOptions,
      statuses: statusOptions,
    };
  }, [pipeline.builds, selectedBranch, selectedCreator, selectedStatus]);

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
    const filteredBuilds = builds.filter(
      build =>
        (selectedCreator === 'all' || build.author.name === selectedCreator) &&
        (selectedStatus === 'all' || build.status === selectedStatus),
    );

    if (
      filteredBuilds.length === 0 ||
      (selectedBranch !== 'all' && selectedBranch !== branch)
    ) {
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
              ({filteredBuilds.length} builds)
            </span>
          </Box>
          {isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </Box>
        {!isCollapsed && renderBuilds(filteredBuilds)}
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

      <Grid container spacing={3} direction="column">
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <Box className={classes.filterContainer}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.filter}
              >
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  onChange={e => setSelectedBranch(e.target.value as string)}
                  label="Branch"
                >
                  <MenuItem value="all">All branches</MenuItem>
                  {Object.entries(filterOptions.branches)
                    .sort(([a], [b]) =>
                      a === 'main' ? -1 : b === 'main' ? 1 : a.localeCompare(b),
                    )
                    .map(([branch, count]) => (
                      <MenuItem key={branch} value={branch}>
                        {branch} ({count} builds)
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                className={classes.filter}
              >
                <InputLabel>Creator</InputLabel>
                <Select
                  value={selectedCreator}
                  onChange={e => setSelectedCreator(e.target.value as string)}
                  label="Creator"
                >
                  <MenuItem value="all">All creators</MenuItem>
                  {Object.entries(filterOptions.creators)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([creator, count]) => (
                      <MenuItem key={creator} value={creator}>
                        {creator} ({count} builds)
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                className={classes.filter}
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as string)}
                  label="Status"
                >
                  <MenuItem value="all">All states</MenuItem>
                  {Object.entries(filterOptions.statuses)
                    .sort(([a, _], [b, __]) => a.localeCompare(b))
                    .map(([status, count]) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).toLowerCase()}{' '}
                        ({count} builds)
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                onClick={toggleAllBuilds}
                aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
                className={classes.expandButton}
              >
                {allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              </Button>
            </Box>
          </Box>

          <Paper variant="outlined">
            {groupedBuilds.main.length > 0 &&
              renderBranchSection('main', groupedBuilds.main)}

            {sortedBranches.map(branch =>
              renderBranchSection(branch, groupedBuilds.other[branch]),
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PipelineView;
