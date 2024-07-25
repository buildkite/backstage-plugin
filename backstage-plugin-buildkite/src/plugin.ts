import { buildkiteRouteRef } from "./routes";
import {
  createPlugin,
  createRoutableExtension,
} from "@backstage/core-plugin-api";

export const buildkitePlugin = createPlugin({
  id: "buildkite",
});

export const EntityBuidlkiteContent = buildkitePlugin.provide(
  createRoutableExtension({
    name: "EntityBuidlkiteContent",
    component: () => import("./components/Router").then((m) => m.Router),
    mountPoint: buildkiteRouteRef,
  })
);
