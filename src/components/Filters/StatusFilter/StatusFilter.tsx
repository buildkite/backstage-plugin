import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  filter: {
    width: '100%',
  },
});

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  states: Record<string, number>;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  states,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" size="small" className={classes.filter}>
      <InputLabel>Status</InputLabel>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as string)}
        label="Status"
      >
        <MenuItem value="all">All states</MenuItem>
        {Object.entries(states).map(([status, count]) => (
          <MenuItem key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()} (
            {count} builds)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
