import React from "react";
import { Routes, Route } from "react-router-dom";
import { buildkiteBuildRouteRef } from "../routes";
import { PipelinePage } from "./PipelinePage";
import { BuildPage } from "./BuildPage";

export const Router = () => (
  <Routes>
    <Route path="/" element={<PipelinePage />} />
    <Route path={buildkiteBuildRouteRef.path} element={<BuildPage />} />
  </Routes>
);
