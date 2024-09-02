import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { buildkitePlugin, PipelinePage } from "../src/plugin";

createDevApp()
  .registerPlugin(buildkitePlugin)
  .addPage({
    element: <PipelinePage />,
    title: "Root Page",
    path: "/buildkite",
  })
  .render();
