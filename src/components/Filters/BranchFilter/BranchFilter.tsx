import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  filter: {
    width: '100%',
  },
});

interface BranchFilterProps {
  value: string;
  onChange: (value: string) => void;
  branches: Record<string, number>;
}

export const BranchFilter: React.FC<BranchFilterProps> = ({
  value,
  onChange,
  branches,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" size="small" className={classes.filter}>
      <InputLabel>Branch</InputLabel>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as string)}
        label="Branch"
      >
        <MenuItem value="all">All branches</MenuItem>
        {Object.entries(branches).map(([branch, count]) => (
          <MenuItem key={branch} value={branch}>
            {branch} ({count} builds)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
