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
import { BuildParams } from '..';

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
  onFilteredBuildsChange: (
    builds: BuildParams[],
    filterOperation: (builds: BuildParams[]) => BuildParams[],
  ) => void;
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

  const createFilterOperation =
    (state: FilterState) => (inputBuilds: BuildParams[]) => {
      let result = [...inputBuilds];

      if (state.selectedBranch !== 'all') {
        result = result.filter(build => build.branch === state.selectedBranch);
      }

      if (state.selectedCreator !== 'all') {
        result = result.filter(
          build => build.author.name === state.selectedCreator,
        );
      }

      if (state.selectedStatus !== 'all') {
        result = result.filter(build => build.status === state.selectedStatus);
      }

      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase();
        result = result.filter(
          build =>
            build.buildMessage.toLowerCase().includes(searchLower) ||
            build.buildNumber.toLowerCase().includes(searchLower) ||
            build.author.name.toLowerCase().includes(searchLower) ||
            build.branch.toLowerCase().includes(searchLower) ||
            build.commitId.toLowerCase().includes(searchLower),
        );
      }

      result = result.filter(build => {
        const buildDate = new Date(build.createdAt);
        return (
          buildDate >= state.dateRange.startDate &&
          buildDate <= state.dateRange.endDate
        );
      });

      return result;
    };

  // Calculate filter options based on current builds
  const getFilterOptions = useCallback(() => {
    return builds.reduce(
      (acc, build) => {
        acc.branches[build.branch] = (acc.branches[build.branch] || 0) + 1;
        acc.creators[build.author.name] =
          (acc.creators[build.author.name] || 0) + 1;
        acc.statuses[build.status] = (acc.statuses[build.status] || 0) + 1;
        return acc;
      },
      { branches: {}, creators: {}, statuses: {} } as Record<
        string,
        Record<string, number>
      >,
    );
  }, [builds]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilterState = { ...filterState, [key]: value };
    setFilterState(newFilterState);
    const filterOperation = createFilterOperation(newFilterState);
    const filteredBuilds = filterOperation(builds);
    onFilteredBuildsChange(filteredBuilds, filterOperation);
  };

  const filterOptions = getFilterOptions();

  return (
    <Box className={classes.filterContainer}>
      <SearchFilter
        builds={builds}
        onSearchChange={term => handleFilterChange('searchTerm', term)}
        currentSearchTerm={filterState.searchTerm}
      />

      <DateRangeFilter
        onDateRangeChange={(startDate, endDate) =>
          handleFilterChange('dateRange', { startDate, endDate })
        }
        initialDateRange={filterState.dateRange}
      />

      <BranchFilter
        value={filterState.selectedBranch}
        onChange={value => handleFilterChange('selectedBranch', value)}
        branches={filterOptions.branches}
      />

      <CreatorFilter
        value={filterState.selectedCreator}
        onChange={value => handleFilterChange('selectedCreator', value)}
        creators={filterOptions.creators}
      />

      <StateFilter
        value={filterState.selectedStatus}
        onChange={value => handleFilterChange('selectedStatus', value)}
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
