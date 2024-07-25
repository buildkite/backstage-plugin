import React from "react";
import { Grid } from "@material-ui/core";
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
} from "@backstage/core-components";

import { PipelineFetchComponent } from "../PipelineFetchComponent";
import { pipelinesDummyData } from "./data";

export const PipelineComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to buildkite!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="CI/CD" />
      <Grid container spacing={3} direction="column">
        {pipelinesDummyData.map((pipeline, index) => (
          <Grid item key={index}>
            <PipelineFetchComponent pipeline={pipeline} />
          </Grid>
        ))}
      </Grid>
    </Content>
  </Page>
);
