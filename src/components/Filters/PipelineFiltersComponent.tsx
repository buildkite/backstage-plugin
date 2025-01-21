import React, { useState, useCallback } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import { DateRangeFilter } from './DateRangeComponent';
import { BuildParams } from '../Types';

const useStyles = makeStyles({
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filter: {
    minWidth: '200px',
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

interface FilterOptions {
  branches: Record<string, number>;
  creators: Record<string, number>;
  statuses: Record<string, number>;
}

interface FilterState {
  selectedBranch: string;
  selectedCreator: string;
  selectedStatus: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface PipelineFiltersProps {
  builds: BuildParams[];
  onFilteredBuildsChange: (builds: BuildParams[]) => void;
  allExpanded: boolean;
  onToggleAllBuilds: () => void;
}

export const PipelineFilters: React.FC<PipelineFiltersProps> = ({
  builds,
  onFilteredBuildsChange,
  allExpanded,
  onToggleAllBuilds,
}) => {
  const classes = useStyles();
  const [filters, setFilters] = useState<FilterState>({
    selectedBranch: 'all',
    selectedCreator: 'all',
    selectedStatus: 'all',
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
  });

  const filterOptions = useCallback((): FilterOptions => {
    return builds.reduce(
      (acc, build) => {
        // Branch counts
        acc.branches[build.branch] = (acc.branches[build.branch] || 0) + 1;

        // Creator counts
        acc.creators[build.author.name] =
          (acc.creators[build.author.name] || 0) + 1;

        // Status counts
        acc.statuses[build.status] = (acc.statuses[build.status] || 0) + 1;

        return acc;
      },
      { branches: {}, creators: {}, statuses: {} } as FilterOptions,
    );
  }, [builds]);

  const applyFilters = useCallback(() => {
    let filteredBuilds = [...builds];

    // Apply branch filter
    if (filters.selectedBranch !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.branch === filters.selectedBranch,
      );
    }

    // Apply creator filter
    if (filters.selectedCreator !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.author.name === filters.selectedCreator,
      );
    }

    // Apply status filter
    if (filters.selectedStatus !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.status === filters.selectedStatus,
      );
    }

    // Apply date range filter
    filteredBuilds = filteredBuilds.filter(build => {
      const buildDate = new Date(build.createdAt);
      return (
        buildDate >= filters.dateRange.startDate &&
        buildDate <= filters.dateRange.endDate
      );
    });

    onFilteredBuildsChange(filteredBuilds);
  }, [builds, filters, onFilteredBuildsChange]);

  const handleFilterChange = (
    filterType: 'selectedBranch' | 'selectedCreator' | 'selectedStatus',
    value: string,
  ) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };

  // Apply filters whenever they change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const options = filterOptions();

  return (
    <Box className={classes.filterContainer}>
      <DateRangeFilter onDateRangeChange={handleDateRangeChange} />

      <FormControl variant="outlined" size="small" className={classes.filter}>
        <InputLabel>Branch</InputLabel>
        <Select
          value={filters.selectedBranch}
          onChange={e =>
            handleFilterChange('selectedBranch', e.target.value as string)
          }
          label="Branch"
        >
          <MenuItem value="all">All branches</MenuItem>
          {Object.entries(options.branches).map(([branch, count]) => (
            <MenuItem key={branch} value={branch}>
              {branch} ({count} builds)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className={classes.filter}>
        <InputLabel>Creator</InputLabel>
        <Select
          value={filters.selectedCreator}
          onChange={e =>
            handleFilterChange('selectedCreator', e.target.value as string)
          }
          label="Creator"
        >
          <MenuItem value="all">All creators</MenuItem>
          {Object.entries(options.creators).map(([creator, count]) => (
            <MenuItem key={creator} value={creator}>
              {creator} ({count} builds)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" className={classes.filter}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.selectedStatus}
          onChange={e =>
            handleFilterChange('selectedStatus', e.target.value as string)
          }
          label="Status"
        >
          <MenuItem value="all">All states</MenuItem>
          {Object.entries(options.statuses).map(([status, count]) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()} (
              {count} builds)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        size="small"
        onClick={onToggleAllBuilds}
        aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
        className={classes.expandButton}
      >
        {allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
      </Button>
    </Box>
  );
};

export default PipelineFilters;
