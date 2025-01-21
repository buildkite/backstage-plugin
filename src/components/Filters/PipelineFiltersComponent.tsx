import React, { useState, useCallback } from 'react';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import { DateRangeFilter } from './DateRangeComponent';
import { SearchFilter } from './SearchFilterComponent';
import { StateFilter } from './StateFilterComponent';
import { BranchFilter } from './BranchFilterComponent';
import { CreatorFilter } from './CreatorFilterComponent';
import { BuildParams } from '../Types';

const useStyles = makeStyles({
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
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
  const [searchResults, setSearchResults] = useState<BuildParams[]>(builds);
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
        acc.branches[build.branch] = (acc.branches[build.branch] || 0) + 1;
        acc.creators[build.author.name] =
          (acc.creators[build.author.name] || 0) + 1;
        acc.statuses[build.status] = (acc.statuses[build.status] || 0) + 1;
        return acc;
      },
      { branches: {}, creators: {}, statuses: {} } as FilterOptions,
    );
  }, [builds]);

  const applyFilters = useCallback(() => {
    let filteredBuilds = [...searchResults];

    if (filters.selectedBranch !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.branch === filters.selectedBranch,
      );
    }

    if (filters.selectedCreator !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.author.name === filters.selectedCreator,
      );
    }

    if (filters.selectedStatus !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.status === filters.selectedStatus,
      );
    }

    filteredBuilds = filteredBuilds.filter(build => {
      const buildDate = new Date(build.createdAt);
      return (
        buildDate >= filters.dateRange.startDate &&
        buildDate <= filters.dateRange.endDate
      );
    });

    onFilteredBuildsChange(filteredBuilds);
  }, [searchResults, filters, onFilteredBuildsChange]);

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

  const handleSearchChange = (filteredBuilds: BuildParams[]) => {
    setSearchResults(filteredBuilds);
  };

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters, searchResults]);

  const options = filterOptions();

  return (
    <Box className={classes.filterContainer}>
      <SearchFilter builds={builds} onSearchChange={handleSearchChange} />

      <DateRangeFilter onDateRangeChange={handleDateRangeChange} />

      <BranchFilter
        value={filters.selectedBranch}
        onChange={value => handleFilterChange('selectedBranch', value)}
        branches={options.branches}
      />

      <CreatorFilter
        value={filters.selectedCreator}
        onChange={value => handleFilterChange('selectedCreator', value)}
        creators={options.creators}
      />

      <StateFilter
        value={filters.selectedStatus}
        onChange={value => handleFilterChange('selectedStatus', value)}
        states={options.statuses}
      />

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
