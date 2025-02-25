import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  filter: {
    minWidth: '200px',
  },
});

interface CreatorFilterProps {
  value: string;
  onChange: (value: string) => void;
  creators: Record<string, number>;
}

export const CreatorFilter: React.FC<CreatorFilterProps> = ({
  value,
  onChange,
  creators,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" size="small" className={classes.filter}>
      <InputLabel>Creator</InputLabel>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as string)}
        label="Creator"
      >
        <MenuItem value="all">All creators</MenuItem>
        {Object.entries(creators).map(([creator, count]) => (
          <MenuItem key={creator} value={creator}>
            {creator} ({count} builds)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
