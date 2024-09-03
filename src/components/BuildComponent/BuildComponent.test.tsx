import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BuildListing } from "./BuildComponent";
import { mockPipelines } from "../../mockData";

describe("BuildListing", () => {
  it("renders the build pipeline", async () => {
    const pipeline = mockPipelines[0];

    render(<BuildListing pipeline={pipeline} />);

    // Adjust the test to match the structure of your component
    const buildMessage = await screen.findByText("Fix issue with user login");
    const buildNumber = screen.getByText("123");
    const author = screen.getByText("Jane Doe");
    const branch = screen.getByText("main");
    const commitId = screen.getByText("a1b2c3d4");
    const timeElapsed = screen.getByText("36s");

    expect(buildMessage).toBeInTheDocument();
    expect(buildNumber).toBeInTheDocument();
    expect(author).toBeInTheDocument();
    expect(branch).toBeInTheDocument();
    expect(commitId).toBeInTheDocument();
    expect(timeElapsed).toBeInTheDocument();
  });
});
