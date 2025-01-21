import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { BuildParams } from '../Types';

const useStyles = makeStyles({
  searchField: {
    minWidth: '300px',
  },
  endAdornment: {
    visibility: (props: { showClear: boolean }) =>
      props.showClear ? 'visible' : 'hidden',
  },
});

interface SearchFilterProps {
  onSearchChange: (filteredBuilds: BuildParams[]) => void;
  builds: BuildParams[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  builds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles({ showClear: Boolean(searchTerm) });

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (!term.trim()) {
        onSearchChange(builds);
        return;
      }

      const searchLower = term.toLowerCase();
      const filtered = builds.filter(
        build =>
          build.buildMessage.toLowerCase().includes(searchLower) ||
          build.buildNumber.toLowerCase().includes(searchLower) ||
          build.author.name.toLowerCase().includes(searchLower) ||
          build.branch.toLowerCase().includes(searchLower) ||
          build.commitId.toLowerCase().includes(searchLower),
      );

      onSearchChange(filtered);
    },
    [builds, onSearchChange],
  );

  const clearSearch = () => {
    handleSearch('');
  };

  return (
    <TextField
      className={classes.searchField}
      variant="outlined"
      size="small"
      placeholder="Search builds..."
      value={searchTerm}
      onChange={e => handleSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end" className={classes.endAdornment}>
            <IconButton
              size="small"
              onClick={clearSearch}
              aria-label="clear search"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
