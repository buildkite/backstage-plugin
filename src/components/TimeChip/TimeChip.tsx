import React from "react";
import { Chip, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chip: {
    color: "inherit",
    border: "none",
    borderRadius: "4px",
    margin: 0,
  },
});

type TimeChipProps = {
  dateString: string;
  isUTC: boolean;
  onTimeClick: () => void;
  triggerType?: string; // Optional triggerType prop
};

export const TimeChip: React.FC<TimeChipProps> = (TimeChipProps) => {
  const classes = useStyles();

  const formatDate = (
    dateString: string,
    toUTC: boolean,
    triggerType?: string
  ) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let formattedDate;
    if (toUTC) {
      const utcDay = date.toUTCString().slice(0, 3);
      const utcDayOfMonth = date.getUTCDate();
      const utcMonth = date.toUTCString().slice(8, 11);
      const utcYear = date.getUTCFullYear();
      const utcTime = date.toUTCString().slice(17, 22);
      formattedDate = `Created ${utcDay} ${utcDayOfMonth}th ${utcMonth} ${utcYear} at ${utcTime} UTC`;
    } else if (date.toDateString() === now.toDateString()) {
      formattedDate = `Created today at ${time}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      formattedDate = `Created yesterday at ${time}`;
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      formattedDate = `Created ${dayOfWeek} at ${time}`;
    } else {
      formattedDate = `Created ${dayOfWeek} ${day}th ${month} at ${time}`;
    }

    if (triggerType) {
      formattedDate += ` - triggered from ${triggerType}`;
    }

    return formattedDate;
  };

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
