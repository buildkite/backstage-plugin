import React, { useState } from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
}) => {
  const classes = useStyles();
  const [selectedRange, setSelectedRange] = useState<DateRangeType>(
    DATE_RANGES.LAST_7_DAYS,
  );
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

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

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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

        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          margin="none"
          size="small"
          label="Start Date"
          value={startDate}
          onChange={date => handleDateChange(true, date)}
          className={classes.datePicker}
          autoOk
          disableFuture
          maxDate={endDate}
        />

        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          margin="none"
          size="small"
          label="End Date"
          value={endDate}
          onChange={date => handleDateChange(false, date)}
          className={classes.datePicker}
          autoOk
          disableFuture
          minDate={startDate}
        />
      </Box>
    </MuiPickersUtilsProvider>
  );
};

export default DateRangeFilter;
