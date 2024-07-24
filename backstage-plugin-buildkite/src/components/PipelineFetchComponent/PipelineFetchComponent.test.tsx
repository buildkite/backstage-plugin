import React from "react";
import { render, screen } from "@testing-library/react";
import { PipelineFetchComponent } from "./PipelineFetchComponent";

describe("PipelineFetchComponent", () => {
  it("renders the build pipeline", async () => {
    render(<PipelineFetchComponent />);

    // Wait for the builds to render
    const buildMessage = await screen.findByText("Fix issue with user login");
    const buildNumber = screen.getByText("#123");
    const author = screen.getByText("Jane Doe");
    const branch = screen.getByText("main");
    const commitId = screen.getByText("a1b2c3d4");
    const timeElapsed = screen.getByText("36s");

    // Assert that the build pipeline contains the expected build data
    expect(buildMessage).toBeInTheDocument();
    expect(buildNumber).toBeInTheDocument();
    expect(author).toBeInTheDocument();
    expect(branch).toBeInTheDocument();
    expect(commitId).toBeInTheDocument();
    expect(timeElapsed).toBeInTheDocument();
  });
});
