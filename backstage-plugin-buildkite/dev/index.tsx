import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { buildkitePlugin, EntityBuildkiteContent } from "../src/plugin";

createDevApp()
  .registerPlugin(buildkitePlugin)
  .addPage({
    element: <EntityBuildkiteContent />,
    title: "Root Page",
    path: "/buildkite",
  })
  .render();
