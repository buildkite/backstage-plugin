import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, Chip, Box, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  filter: {
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  chip: {
    margin: 2,
    maxWidth: '80px',
  },
  countChip: {
    margin: 2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  menuItem: {
    maxWidth: '100%',
  },
}));

interface CreatorFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  creators: Record<string, number>;
}

// Helper function to truncate text
const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};

export const CreatorFilter: React.FC<CreatorFilterProps> = ({
  value,
  onChange,
  creators,
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValues = event.target.value as string[];
    onChange(selectedValues);
  };

  return (
    <FormControl variant="outlined" size="small" className={classes.filter}>
      <InputLabel>Creators</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        label="Creators"
        renderValue={(selected) => {
          const selectedValues = selected as string[];
          
          if (selectedValues.length === 0) {
            return 'All creators';
          }
          
          return (
            <Box className={classes.chips}>
              {selectedValues.length <= 2 ? (
                // Show actual names if 2 or fewer
                selectedValues.map(creator => (
                  <Tooltip key={creator} title={creator}>
                    <Chip 
                      label={truncate(creator, 10)} 
                      className={classes.chip} 
                      size="small" 
                    />
                  </Tooltip>
                ))
              ) : (
                // Show first name + count when more than 2
                <>
                  <Tooltip title={selectedValues[0]}>
                    <Chip 
                      label={truncate(selectedValues[0], 10)} 
                      className={classes.chip} 
                      size="small" 
                    />
                  </Tooltip>
                  <Tooltip title={`${selectedValues.length - 1} more selected`}>
                    <Chip 
                      label={`+${selectedValues.length - 1}`} 
                      className={classes.countChip} 
                      size="small" 
                    />
                  </Tooltip>
                </>
              )}
            </Box>
          );
        }}
      >
        {Object.entries(creators).map(([creator, count]) => (
          <MenuItem key={creator} value={creator} className={classes.menuItem}>
            <Checkbox checked={value.indexOf(creator) > -1} />
            <ListItemText primary={`${creator} (${count} builds)`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
