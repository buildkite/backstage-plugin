import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

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
  onSearchChange: (term: string) => void;
  builds: Array<any>; // Keep this for consistency with the existing API
  currentSearchTerm: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  currentSearchTerm,
}) => {
  const classes = useStyles({ showClear: Boolean(currentSearchTerm) });

  const handleSearch = (term: string) => {
    onSearchChange(term);
  };

  const clearSearch = () => {
    handleSearch('');
  };

  return (
    <TextField
      className={classes.searchField}
      variant="outlined"
      size="small"
      placeholder="Search builds..."
      value={currentSearchTerm}
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
