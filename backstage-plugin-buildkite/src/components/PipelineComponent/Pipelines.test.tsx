import React from "react";
import { PipelineComponent } from "./Pipelines";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { screen } from "@testing-library/react";
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";

describe("PipelineComponent", () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get("/*", (_, res, ctx) => res(ctx.status(200), ctx.json({})))
    );
  });

  it("should render", async () => {
    await renderInTestApp(<PipelineComponent />);
    expect(screen.getByText("Welcome to buildkite!")).toBeInTheDocument();
  });

  it("renders multiple pipelines with builds", async () => {
    await renderInTestApp(<PipelineComponent />);

    // Check for the first pipeline
    expect(await screen.findByText("ads-promo-client")).toBeInTheDocument();
    expect(
      await screen.findByText("Fix issue with user login")
    ).toBeInTheDocument();
    expect(await screen.findByText("#123")).toBeInTheDocument();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    const mainBranches = await screen.findAllByText("main");
    expect(mainBranches.length).toBeGreaterThanOrEqual(2); // Expect at least 2 instances of "main"
    expect(await screen.findByText("a1b2c3d4")).toBeInTheDocument();
    expect(await screen.findByText("36s")).toBeInTheDocument();

    // Check for the second pipeline
    expect(await screen.findByText("another-pipeline")).toBeInTheDocument();
    expect(
      await screen.findByText("Fix issue with checkout")
    ).toBeInTheDocument();
    expect(await screen.findByText("#201")).toBeInTheDocument();
    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
    expect(await screen.findByText("b1c2d3e4")).toBeInTheDocument();
    expect(await screen.findByText("45s")).toBeInTheDocument();
  });
});
