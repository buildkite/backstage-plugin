import React from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Link,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import { BranchIcon, GithubIcon, StatusIcon } from "../Icons";
import { BuildStep } from "../BuildStepComponent";
import { BuildParams, PipelineParams } from "../Types";
import { useRouteRef } from "@backstage/core-plugin-api";
import { buildkiteBuildRouteRef } from "../../routes";
import { TimeChip } from "../TimeChip";

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
          <StatusIcon status={build.status} size="medium" />
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
          <Box
            display="flex"
            alignItems="center"
            margin={0}
            gridGap="3px"
            color="#737373"
          >
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
            <TimeChip
              dateString={build.createdAt}
              isUTC={isUTC}
              onTimeClick={onTimeClick}
            />
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