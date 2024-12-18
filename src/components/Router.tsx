import React from "react";
import { Routes, Route } from "react-router-dom";
import { buildkiteBuildRouteRef, buildkitePipelineRouteRef } from "../routes";
import { PipelinePage } from "./PipelinePage";
import { BuildPage } from "./BuildPage";
import { Page, Header, HeaderLabel, Content } from "@backstage/core-components";
import { ComponentPage } from "./ComponentPage";

export const Router = () => (
  <Page themeId="tool">
    <Header title="Welcome to buildkite!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <Routes>
        <Route path="/" element={<ComponentPage />} />
        <Route
          path={buildkitePipelineRouteRef.path}
          element={<PipelinePage />}
        />
        <Route path={buildkiteBuildRouteRef.path} element={<BuildPage />} />
      </Routes>
    </Content>
  </Page>
);
