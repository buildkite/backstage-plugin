import React from 'react';
import { Chip, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { formatDate } from '../../utils';

const useStyles = makeStyles(theme => ({
  chip: {
    color: theme.palette.text.secondary,
    border: 'none',
    borderRadius: '4px',
    margin: 0,
  },
}));

type TimeChipProps = {
  dateString: string;
  isUTC: boolean;
  onTimeClick: () => void;
  triggerType?: string; // Optional triggerType prop
};

export const TimeChip: React.FC<TimeChipProps> = ({
  dateString,
  isUTC,
  onTimeClick,
  triggerType,
}) => {
  const classes = useStyles();

  return (
    <Tooltip title="Click to toggle between local and UTC" placement="top">
      <Chip
        className={classes.chip}
        label={formatDate(dateString, isUTC, triggerType)}
        variant="outlined"
        size="small"
        onClick={onTimeClick}
      />
    </Tooltip>
  );
};
