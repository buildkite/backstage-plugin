import { Grid } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
export const BuildPage = () => {
  const params = useParams();
  return (
    <Grid container spacing={3} direction="column">
      <ul>
        <li>pipelineSlug: {params.pipelineSlug}</li>
        <li>buildNumber: {params.buildNumber}</li>
      </ul>
    </Grid>
  );
};
