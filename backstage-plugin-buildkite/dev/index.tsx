import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { buildkitePlugin, EntityBuidlkiteContent } from "../src/plugin";

createDevApp()
  .registerPlugin(buildkitePlugin)
  .addPage({
    element: <EntityBuidlkiteContent />,
    title: "Root Page",
    path: "/buildkite",
  })
  .render();
