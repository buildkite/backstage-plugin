import React from "react";
import { Grid } from "@material-ui/core";

import { pipelinesDummyData } from "./data";
import { PipelineComponent } from "../PipelineComponent/PipelineComponent";

export const PipelinePage = () => (
  <Grid container spacing={3} direction="column">
    {pipelinesDummyData.map((pipeline, index) => (
      <Grid item key={index}>
        <PipelineComponent pipeline={pipeline} />
      </Grid>
    ))}
  </Grid>
);
