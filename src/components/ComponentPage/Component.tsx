import React, { useState } from "react";
import { Box, Grid, Link, Paper, Typography } from "@material-ui/core";
import { useRouteRef } from "@backstage/core-plugin-api";
import { mockPipelines } from "../../mockData";
import { Navatar } from "../Navatar";
import { PipelineParams } from "../Types";
import { BuildRow } from "../BuildComponent/BuildComponent";
import { buildkitePipelineRouteRef } from "../../routes"; // Ensure this path is correct

type PipelineProps = {
  pipeline: PipelineParams;
  isUTC: boolean;
  onTimeClick: () => void;
};

const Pipeline: React.FC<PipelineProps> = ({
  pipeline,
  isUTC,
  onTimeClick,
}) => {
  const [expanded, setExpanded] = useState<boolean[]>(
    new Array(pipeline.builds.length).fill(false)
  );

  const handleExpandClick = (index: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const getPipelinePath = useRouteRef(buildkitePipelineRouteRef);

  return (
    <Paper variant="outlined" style={{ overflow: "hidden" }}>
      <Box
        display="flex"
        flexDirection="row"
        gridGap="8px"
        alignItems="center"
        bgcolor="#F8F8F8"
        borderBottom="1px solid #E5E5E5"
        padding="8px"
      >
        <Navatar color={pipeline.navatarColor} image={pipeline.navatarImage} />
        <Link
          color="textPrimary"
          href={getPipelinePath({ pipelineSlug: pipeline.name })}
        >
          <Typography
            variant="h5"
            style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
          >
            {pipeline.name}
          </Typography>
        </Link>
      </Box>
      {pipeline.builds.map((build, index) => (
        <BuildRow
          key={build.buildNumber}
          build={build}
          pipeline={pipeline}
          index={index}
          expanded={expanded[index]}
          onExpandClick={handleExpandClick}
          isUTC={isUTC}
          onTimeClick={onTimeClick}
        />
      ))}
    </Paper>
  );
};

export const ComponentPage = () => {
  const [isUTC, setIsUTC] = useState(false);

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  return (
    <Grid container spacing={3} direction="column">
      {mockPipelines.map((pipeline, index) => (
        <Grid item key={index}>
          <Pipeline
            pipeline={pipeline}
            isUTC={isUTC}
            onTimeClick={handleTimeClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};
