import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { useBuilds } from "../../state/useBuild";

export const BuildPage = () => {
  const { pipelineSlug, buildNumber } = useParams<{
    pipelineSlug: any;
    buildNumber: any;
  }>();
  const { build, loading } = useBuilds(pipelineSlug, buildNumber);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!build) {
    return <Typography>Build not found</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gridGap="20px">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          {pipelineSlug}
        </Link>
        <Typography color="textPrimary">{buildNumber}</Typography>
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
      </Grid>
    </Box>
  );
};
