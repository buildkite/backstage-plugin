import React, { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Paper,
  Typography,
  Link,
} from "@material-ui/core";
import { Navatar } from "../Navatar";
import { BuildParams, PipelineParams } from "../Types";
import { BuildRow } from "../BuildComponent/BuildComponent";
import { useParams } from "react-router-dom";
import { usePipeline } from "../../state/usePipelines";
import { BranchIcon } from "../Icons";

type PipelineProps = {
  pipeline: PipelineParams;
};

interface BuildsByBranch {
  [branch: string]: BuildParams[];
}

const groupBuildsByBranch = (builds: BuildParams[]): BuildsByBranch => {
  return builds.reduce((acc: BuildsByBranch, build: BuildParams) => {
    if (!acc[build.branch]) {
      acc[build.branch] = [];
    }
    acc[build.branch].push(build);
    return acc;
  }, {});
};

const Pipeline: React.FC<PipelineProps> = ({ pipeline }) => {
  const [isUTC, setIsUTC] = useState(false);
  const [expanded, setExpanded] = useState<{ [branch: string]: boolean[] }>(
    Object.fromEntries(
      Object.keys(groupBuildsByBranch(pipeline.builds)).map((branch) => [
        branch,
        new Array(groupBuildsByBranch(pipeline.builds)[branch].length).fill(
          false
        ),
      ])
    )
  );

  const handleExpandClick = (branch: string, index: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = { ...prevExpanded };
      newExpanded[branch][index] = !newExpanded[branch][index];
      return newExpanded;
    });
  };

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  const buildsByBranch = groupBuildsByBranch(pipeline.builds);

  return (
    <>
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

          <Typography
            variant="h5"
            color="textPrimary"
            style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
          >
            {pipeline.name}
          </Typography>
        </Box>
      </Breadcrumbs>
      <Box
        display="flex"
        flexDirection="column"
        gridGap="30px"
        marginTop="20px"
      >
        {Object.entries(buildsByBranch).map(([branch, builds]) => (
          <Paper key={branch} variant="outlined" style={{ overflow: "hidden" }}>
            <Box
              display="flex"
              flexDirection="row"
              gridGap="4px"
              alignItems="center"
              bgcolor="#F8F8F8"
              borderBottom="1px solid #E5E5E5"
              padding="8px"
            >
              <BranchIcon style={{ color: "grey", fontSize: "14px" }} />
              <Typography
                variant="h5"
                style={{
                  fontSize: "13px",
                  color: "#737373",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {branch}
              </Typography>
            </Box>

            {builds.map((build, index) => (
              <BuildRow
                key={build.buildNumber}
                build={build}
                pipeline={pipeline}
                index={index}
                expanded={expanded[branch][index]}
                onExpandClick={() => handleExpandClick(branch, index)}
                isUTC={isUTC}
                onTimeClick={handleTimeClick}
              />
            ))}
          </Paper>
        ))}
      </Box>
    </>
  );
};

export const PipelinePage = () => {
  const { pipelineSlug } = useParams<{
    pipelineSlug?: string;
  }>();

  if (!pipelineSlug) {
    return <Typography>Invalid URL parameters</Typography>;
  }

  const { pipeline, loading } = usePipeline(pipelineSlug);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!pipeline) {
    return <Typography>Pipeline not found</Typography>;
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Pipeline pipeline={pipeline} />
      </Grid>
    </Grid>
  );
};
