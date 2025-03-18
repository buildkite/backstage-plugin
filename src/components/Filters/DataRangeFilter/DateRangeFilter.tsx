import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  filterContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  dateRangePreset: {
    minWidth: '150px',
  },
  datePicker: {
    width: '150px',
  },
});

const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7Days',
  LAST_30_DAYS: 'last30Days',
  CUSTOM: 'custom',
} as const;

type DateRangeType = (typeof DATE_RANGES)[keyof typeof DATE_RANGES];

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  initialDateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  initialDateRange,
}) => {
  const classes = useStyles();
  const [selectedRange, setSelectedRange] = useState<DateRangeType>(
    DATE_RANGES.LAST_7_DAYS,
  );
  const [startDate, setStartDate] = useState<Date>(
    initialDateRange?.startDate ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState<Date>(
    initialDateRange?.endDate || new Date(),
  );

  useEffect(() => {
    if (initialDateRange) {
      setStartDate(initialDateRange.startDate);
      setEndDate(initialDateRange.endDate);
    }
  }, [initialDateRange]);

  const handlePresetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as DateRangeType;
    setSelectedRange(value);

    let newStartDate = startDate;
    const newEndDate = new Date();

    switch (value) {
      case DATE_RANGES.TODAY:
        newStartDate = new Date();
        newStartDate.setHours(0, 0, 0, 0);
        break;
      case DATE_RANGES.YESTERDAY:
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 1);
        newStartDate.setHours(0, 0, 0, 0);
        break;
      case DATE_RANGES.LAST_7_DAYS:
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 7);
        break;
      case DATE_RANGES.LAST_30_DAYS:
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 30);
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onDateRangeChange(newStartDate, newEndDate);
  };

  const handleDateChange = (isStart: boolean, date: Date | null) => {
    if (!date) return;

    if (isStart) {
      setStartDate(date);
      onDateRangeChange(date, endDate);
    } else {
      setEndDate(date);
      onDateRangeChange(startDate, date);
    }
    setSelectedRange(DATE_RANGES.CUSTOM);
  };

  // Format date as YYYY-MM-DD for HTML input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setStartDate(newDate);
    onDateRangeChange(newDate, endDate);
    setSelectedRange(DATE_RANGES.CUSTOM);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setEndDate(newDate);
    onDateRangeChange(startDate, newDate);
    setSelectedRange(DATE_RANGES.CUSTOM);
  };

  return (
    <Box className={classes.filterContainer}>
      <FormControl
        variant="outlined"
        size="small"
        className={classes.dateRangePreset}
      >
        <InputLabel>Date Range</InputLabel>
        <Select
          value={selectedRange}
          onChange={handlePresetChange}
          label="Date Range"
        >
          <MenuItem value={DATE_RANGES.TODAY}>Today</MenuItem>
          <MenuItem value={DATE_RANGES.YESTERDAY}>Yesterday</MenuItem>
          <MenuItem value={DATE_RANGES.LAST_7_DAYS}>Last 7 days</MenuItem>
          <MenuItem value={DATE_RANGES.LAST_30_DAYS}>Last 30 days</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Start Date"
        type="date"
        variant="outlined"
        size="small"
        className={classes.datePicker}
        value={formatDateForInput(startDate)}
        onChange={handleStartDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: formatDateForInput(endDate),
        }}
      />

      <TextField
        label="End Date"
        type="date"
        variant="outlined"
        size="small"
        className={classes.datePicker}
        value={formatDateForInput(endDate)}
        onChange={handleEndDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: formatDateForInput(startDate),
          max: formatDateForInput(new Date()),
        }}
      />
    </Box>
  );
};

export default DateRangeFilter;
