import React, { useState } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useRouteRef } from "@backstage/core-plugin-api";
import { useBuilds } from "../../state/useBuilds";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Navatar } from "../Navatar";
import { buildkitePipelineRouteRef } from "../../routes";
import { Job } from "../JobComponent";
import { BranchIcon, GithubIcon, StatusIcon } from "../Icons";
import { BuildStep } from "../BuildStepComponent";
import { TimeChip } from "../TimeChip";

interface BuildStateColors {
  main: string;
  subtle: string;
}

const buildStateColors: Record<string, BuildStateColors> = {
  PASSED: {
    main: "#55BB3B",
    subtle: "#FBFDFA",
  },
  FAILED: {
    main: "#F83F23",
    subtle: "#FDF5F5",
  },
  RUNNING: {
    main: "#F5BD44",
    subtle: "#FEF8E9",
  },
  DEFAULT: {
    main: "#000000",
    subtle: "#FFFFFF",
  },
};

const getBuildStateColors = (state: string): BuildStateColors =>
  buildStateColors[state] || buildStateColors.DEFAULT;

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    border: "1px solid #e8e8e8",
    borderRadius: "4px",
    width: "fit-content",
    padding: "2px",
  },
  indicator: {
    backgroundColor: "transparent",
  },
  tab: {
    fontSize: "13px",
    width: "fit-content",
    minWidth: "fit-content",
    borderRadius: "2px",
    padding: "4px 8px",
    color: "#333333",
    opacity: 1,
    "&$selected": {
      color: "#4B19D5",
      backgroundColor: "#F1EFFF",
      fontWeight: theme.typography.fontWeightMedium,
      "&:focus": {
        color: "#4B19D5",
        backgroundColor: "#F1EFFF",
      },
      "&:active": {
        color: "#4B19D5",
        backgroundColor: "#F1EFFF",
      },
      "&:hover": {
        color: "#4B19D5",
        backgroundColor: "#F1EFFF",
      },
    },
    "&:focus": {
      color: "inherit",
      backgroundColor: "inherit",
    },
    "&:active": {
      color: "inherit",
      backgroundColor: "inherit",
    },
    "&:hover": {
      color: "inherit",
      backgroundColor: "inherit",
    },
  },
  selected: Object,
}));

export const BuildPage = () => {
  const { pipelineSlug, buildNumber } = useParams<{
    pipelineSlug?: string;
    buildNumber?: string;
  }>();

  const getPipelinePath = useRouteRef(buildkitePipelineRouteRef);
  const { pipeline, build, steps, loading } = useBuilds(
    pipelineSlug!,
    buildNumber!
  );

  const [isUTC, setIsUTC] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const onTimeClick = () => {
    setIsUTC(!isUTC);
  };

  const handleTabChange = (event: React.ChangeEvent<object>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredSteps =
    selectedTab === 0
      ? steps
      : steps.filter(
          (step) =>
            step.status === "FAILED" ||
            step.status === "SKIPPED" ||
            step.status === "CANCELED"
        );

  const classes = useStyles();

  if (!pipelineSlug || !buildNumber) {
    return <Typography>Invalid URL parameters</Typography>;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!pipeline) {
    return <Typography>Pipeline not found</Typography>;
  }

  if (!build) {
    return <Typography>Build not found</Typography>;
  }

  const { main, subtle } = getBuildStateColors(build.status);

  return (
    <Box display="flex" flexDirection="column" gridGap="20px">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          <Typography
            variant="h5"
            style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
          >
            Home
          </Typography>
        </Link>
        <Box
          display="flex"
          flexDirection="row"
          gridGap="8px"
          alignItems="center"
        >
          <Navatar
            color={pipeline.navatarColor}
            image={pipeline.navatarImage}
          />
          <Link color="inherit" href={getPipelinePath({ pipelineSlug })}>
            <Typography
              variant="h5"
              style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
            >
              {pipeline.name}
            </Typography>
          </Link>
        </Box>
        <Typography
          style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
          color="textPrimary"
        >
          #{buildNumber}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3} direction="column">
        <Paper>
          <Box
            overflow="hidden"
            borderRadius="4px"
            border={`1px solid ${main}`}
            borderTop={`4px solid ${main}`}
            bgcolor={subtle}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingX="20px"
              paddingY="12px"
              borderBottom={`1px solid ${main}`}
            >
              <Box display="flex" flexDirection="column" gridGap="4px">
                <Typography
                  variant="h6"
                  style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}
                >
                  {build.buildMessage}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  margin={0}
                  gridGap="3px"
                  marginLeft="-8px"
                >
                  <Chip
                    style={{
                      color: "#4F4F4F",
                      border: "none",
                      borderRadius: "4px",
                      margin: 0,
                    }}
                    label={`Build #${build.buildNumber}`}
                    variant="outlined"
                    size="small"
                  />

                  <Typography style={{ color: "#111111", fontSize: "12px" }}>
                    ·
                  </Typography>
                  <Chip
                    style={{
                      color: "#4F4F4F",
                      border: "none",
                      borderRadius: "4px",
                      margin: 0,
                      paddingLeft: "4px",
                    }}
                    icon={<BranchIcon size="small" />}
                    label={build.branch}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption">/</Typography>
                  <Chip
                    style={{
                      color: "#4F4F4F",
                      border: "none",
                      borderRadius: "4px",
                      margin: 0,
                      paddingLeft: "4px",
                    }}
                    icon={<GithubIcon viewBox="0 0 13 13" />}
                    label={build.commitId}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                gridGap="8px"
                alignItems="center"
              >
                <span>Running for {build.timeElapsed}</span>
                <StatusIcon status={build.status} size="large" />
              </Box>
            </Box>
            <Box
              display="flex"
              gridGap="4px"
              alignItems="center"
              flexWrap="wrap"
              bgcolor="white"
              paddingX="20px"
              paddingY="12px"
            >
              {build.steps.map((step) => (
                <BuildStep key={step.id} step={step} />
              ))}
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f8f8f8"
              paddingX="20px"
              paddingY="12px"
              boxShadow="inset 0px 1px 4px rgba(0, 0, 0, 0.1)"
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gridGap="4px"
                color="#4F4F4F"
              >
                <Chip
                  style={{
                    color: "#4F4F4F",
                    border: "none",
                    borderRadius: "4px",
                    margin: 0,
                  }}
                  avatar={<Avatar src={build.author.avatar} />}
                  label={build.author.name}
                  variant="outlined"
                  size="small"
                />
                <Typography style={{ color: "#111111", fontSize: "12px" }}>
                  ·
                </Typography>
                <TimeChip
                  {...{
                    dateString: build.createdAt,
                    isUTC,
                    onTimeClick,
                    triggerType: "Webhook",
                  }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gridGap="8px"
              >
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    textTransform: "none",
                  }}
                  startIcon={
                    <AutorenewIcon
                      fontSize="small"
                      style={{
                        rotate: "45deg",
                      }}
                    />
                  }
                >
                  Rebuild
                </Button>
                {build.status === "RUNNING" && (
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    style={{
                      textTransform: "none",
                      backgroundColor: "white",
                      color: "#F83F23",
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box display="flex" flexDirection="column" gridGap="8px" mt="30px">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            className={classes.tabs}
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              label="All"
              classes={{ root: classes.tab, selected: classes.selected }}
            />
            <Tab
              label="Failures"
              classes={{ root: classes.tab, selected: classes.selected }}
            />
          </Tabs>
          <Box display="flex" flexDirection="column" gridGap="8px" mt="12px">
            {filteredSteps.map((step) => (
              <Job key={step.id} {...{ step }} />
            ))}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
