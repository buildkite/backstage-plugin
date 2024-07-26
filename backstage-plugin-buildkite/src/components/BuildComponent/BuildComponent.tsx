import React from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Link,
  IconButton,
  Collapse,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import { BranchIcon, GithubIcon } from "../Icons";
import { BuildStep } from "../BuildStepComponent";
import { BuildParams, PipelineParams } from "../Types";
import { useRouteRef } from "@backstage/core-plugin-api";
import { buildkiteBuildRouteRef } from "../../routes"; // Ensure this path is correct

const useStyles = makeStyles({
  buildRow: {
    "&:not(:last-child)": {
      borderBottom: "1px solid #E5E5E5",
    },
  },
  chip: {
    color: "#737373",
    border: "none",
    borderRadius: "4px",
    margin: 0,
  },
});

type BuildRowProps = {
  build: BuildParams;
  pipeline: PipelineParams;
  index: number;
  expanded: boolean;
  onExpandClick: (index: number) => void;
  isUTC: boolean;
  onTimeClick: () => void;
};

export const BuildRow: React.FC<BuildRowProps> = ({
  build,
  pipeline,
  index,
  expanded,
  onExpandClick,
  isUTC,
  onTimeClick,
}) => {
  const classes = useStyles();
  const getBuildPath = useRouteRef(buildkiteBuildRouteRef);

  const formatDate = (dateString: string, toUTC: boolean) => {
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

    if (toUTC) {
      const utcDay = date.toUTCString().slice(0, 3);
      const utcDayOfMonth = date.getUTCDate();
      const utcMonth = date.toUTCString().slice(8, 11);
      const utcYear = date.getUTCFullYear();
      const utcTime = date.toUTCString().slice(17, 22);
      return `Created ${utcDay} ${utcDayOfMonth}th ${utcMonth} ${utcYear} at ${utcTime} UTC`;
    } else if (date.toDateString() === now.toDateString()) {
      return `Created today at ${time}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Created yesterday at ${time}`;
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return `Created ${dayOfWeek} at ${time}`;
    } else {
      return `Created ${dayOfWeek} ${day}th ${month} at ${time}`;
    }
  };

  return (
    <Box className={classes.buildRow} key={build.buildNumber}>
      <Box
        display="flex"
        padding="12px"
        gridGap="12px"
        className={classes.buildRow}
      >
        <Box
          display="flex"
          flexDirection="column"
          gridGap="6px"
          alignItems="center"
        >
          {build.statusIcon}
          <Typography
            variant="caption"
            style={{ color: "#737373", paddingTop: "1px" }}
          >
            {build.timeElapsed}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gridGap="4px">
          <Box
            display="flex"
            paddingLeft="4px"
            gridGap="6px"
            alignItems="center"
          >
            <Link
              color="textPrimary"
              href={getBuildPath({
                pipelineSlug: pipeline.name,
                buildNumber: build.buildNumber,
              })}
            >
              <Typography variant="subtitle2">
                <strong>{build.buildMessage}</strong>
              </Typography>
            </Link>
            <Typography
              variant="caption"
              style={{ color: "#737373", paddingTop: "3px" }}
            >
              #{build.buildNumber}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" margin={0} gridGap="3px">
            <Chip
              className={classes.chip}
              avatar={<Avatar src={build.author.avatar} />}
              label={build.author.name}
              variant="outlined"
              size="small"
            />
            <Typography style={{ color: "#111111", fontSize: "12px" }}>
              ·
            </Typography>
            <Chip
              className={classes.chip}
              style={{ paddingLeft: "4px" }}
              icon={<BranchIcon size="small" />}
              label={build.branch}
              variant="outlined"
              size="small"
            />
            <Typography variant="caption">/</Typography>
            <Chip
              className={classes.chip}
              style={{ paddingLeft: "4px" }}
              icon={<GithubIcon viewBox="0 0 13 13" />}
              label={build.commitId}
              variant="outlined"
              size="small"
            />
            <Typography style={{ color: "#111111", fontSize: "12px" }}>
              ·
            </Typography>
            <Tooltip
              title="Click to toggle between local and UTC"
              placement="top"
            >
              <Chip
                className={classes.chip}
                label={formatDate(build.createdAt, isUTC)}
                variant="outlined"
                size="small"
                onClick={onTimeClick}
              />
            </Tooltip>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={() => onExpandClick(index)}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ marginLeft: "auto", borderRadius: "4px" }}
        >
          {expanded ? (
            <UnfoldLessIcon fontSize="inherit" />
          ) : (
            <UnfoldMoreIcon fontSize="inherit" />
          )}
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          display="flex"
          gridGap="4px"
          alignItems="center"
          flexWrap="wrap"
          bgcolor="#f8f8f8"
          padding="12px"
          boxShadow="inset 0px 1px 4px rgba(0, 0, 0, 0.1)"
        >
          {build.steps.map((step) => (
            <BuildStep key={step.id} step={step} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
