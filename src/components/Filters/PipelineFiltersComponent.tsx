import React, { useState, useCallback, useEffect } from 'react';
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

interface FilterState {
  selectedBranch: string;
  selectedCreator: string;
  selectedStatus: string;
  searchTerm: string;
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
  const [filterState, setFilterState] = useState<FilterState>({
    selectedBranch: 'all',
    selectedCreator: 'all',
    selectedStatus: 'all',
    searchTerm: '',
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
  });

  const applyFilters = useCallback(() => {
    let filteredBuilds = [...builds];

    // Apply branch filter
    if (filterState.selectedBranch !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.branch === filterState.selectedBranch,
      );
    }

    // Apply creator filter
    if (filterState.selectedCreator !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.author.name === filterState.selectedCreator,
      );
    }

    // Apply status filter
    if (filterState.selectedStatus !== 'all') {
      filteredBuilds = filteredBuilds.filter(
        build => build.status === filterState.selectedStatus,
      );
    }

    // Apply search filter
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filteredBuilds = filteredBuilds.filter(
        build =>
          build.buildMessage.toLowerCase().includes(searchLower) ||
          build.buildNumber.toLowerCase().includes(searchLower) ||
          build.author.name.toLowerCase().includes(searchLower) ||
          build.branch.toLowerCase().includes(searchLower) ||
          build.commitId.toLowerCase().includes(searchLower),
      );
    }

    // Apply date range filter
    filteredBuilds = filteredBuilds.filter(build => {
      const buildDate = new Date(build.createdAt);
      return (
        buildDate >= filterState.dateRange.startDate &&
        buildDate <= filterState.dateRange.endDate
      );
    });

    onFilteredBuildsChange(filteredBuilds);
  }, [builds, filterState, onFilteredBuildsChange]);

  // Apply filters whenever filterState changes
  useEffect(() => {
    applyFilters();
  }, [filterState, applyFilters]);

  // Calculate filter options based on current builds
  const getFilterOptions = useCallback(() => {
    return builds.reduce(
      (acc, build) => {
        // Count occurrences for branches
        acc.branches[build.branch] = (acc.branches[build.branch] || 0) + 1;
        // Count occurrences for creators
        acc.creators[build.author.name] =
          (acc.creators[build.author.name] || 0) + 1;
        // Count occurrences for statuses
        acc.statuses[build.status] = (acc.statuses[build.status] || 0) + 1;
        return acc;
      },
      { branches: {}, creators: {}, statuses: {} } as Record<
        string,
        Record<string, number>
      >,
    );
  }, [builds]);

  const filterOptions = getFilterOptions();

  return (
    <Box className={classes.filterContainer}>
      <SearchFilter
        builds={builds}
        onSearchChange={term =>
          setFilterState(prev => ({ ...prev, searchTerm: term }))
        }
        currentSearchTerm={filterState.searchTerm}
      />

      <DateRangeFilter
        onDateRangeChange={(startDate, endDate) =>
          setFilterState(prev => ({
            ...prev,
            dateRange: { startDate, endDate },
          }))
        }
        initialDateRange={filterState.dateRange}
      />

      <BranchFilter
        value={filterState.selectedBranch}
        onChange={value =>
          setFilterState(prev => ({ ...prev, selectedBranch: value }))
        }
        branches={filterOptions.branches}
      />

      <CreatorFilter
        value={filterState.selectedCreator}
        onChange={value =>
          setFilterState(prev => ({ ...prev, selectedCreator: value }))
        }
        creators={filterOptions.creators}
      />

      <StateFilter
        value={filterState.selectedStatus}
        onChange={value =>
          setFilterState(prev => ({ ...prev, selectedStatus: value }))
        }
        states={filterOptions.statuses}
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
