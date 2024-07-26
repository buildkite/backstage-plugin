import React from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useBuilds } from "../../state/useBuilds"; // Ensure this path is correct
import { Navatar } from "../Navatar";

export const BuildPage = () => {
  const { pipelineSlug, buildNumber } = useParams<{
    pipelineSlug?: string;
    buildNumber?: string;
  }>();

  // Ensure pipelineSlug and buildNumber are defined
  if (!pipelineSlug || !buildNumber) {
    return <Typography>Invalid URL parameters</Typography>;
  }

  const { pipeline, build, steps, loading } = useBuilds(
    pipelineSlug,
    buildNumber
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!pipeline) {
    return <Typography>Pipeline not found</Typography>;
  }

  if (!build) {
    return <Typography>Build not found</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gridGap="20px">
      <Breadcrumbs aria-label="breadcrumb">
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
            style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
          >
            {pipeline.name}
          </Typography>
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
          <Typography variant="h6">{build.buildMessage}</Typography>
          <ul>
            <li>Build Number: {build.buildNumber}</li>
            <li>Author: {build.author.name}</li>
            <li>Branch: {build.branch}</li>
            <li>Commit ID: {build.commitId}</li>
            <li>Created At: {build.createdAt}</li>
            <li>Time Elapsed: {build.timeElapsed}</li>
          </ul>
        </Paper>
        <Paper>
          <Typography variant="h6">Build Steps</Typography>
          <ul>
            {steps.map((step) => (
              <li key={step.id}>
                <img src={step.icon} alt={step.title} width="20" height="20" />{" "}
                {step.title} - {step.status}
              </li>
            ))}
          </ul>
        </Paper>
      </Grid>
    </Box>
  );
};
