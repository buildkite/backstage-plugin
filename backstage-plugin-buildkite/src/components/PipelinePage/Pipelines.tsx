import React from "react";
import { Grid } from "@material-ui/core";

import { mockPipelines } from "../../mockData";
import { PipelineComponent } from "../PipelineComponent/PipelineComponent";

export const PipelinePage = () => (
  <Grid container spacing={3} direction="column">
    {mockPipelines.map((pipeline, index) => (
      <Grid item key={index}>
        <PipelineComponent pipeline={pipeline} />
      </Grid>
    ))}
  </Grid>
);
