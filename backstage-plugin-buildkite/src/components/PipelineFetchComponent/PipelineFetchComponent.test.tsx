import React from "react";
import { render, screen } from "@testing-library/react";
import { PipelineFetchComponent } from "./PipelineFetchComponent";
import { BuildFailed, BuildRunning, BuildPassed } from "../Icons";

describe("PipelineFetchComponent", () => {
  it("renders the build pipeline", async () => {
    const pipeline = {
      name: "ads-promo-client",
      navatarColor: "#B5FFCE",
      navatarImage:
        "https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png",
      builds: [
        {
          statusIcon: <BuildFailed />,
          buildMessage: "Fix issue with user login",
          buildNumber: "123",
          author: {
            avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author1",
            name: "Jane Doe",
          },
          branch: "main",
          commitId: "a1b2c3d4",
          createdAt: "2024-07-24T09:23:00Z",
          timeElapsed: "36s",
        },
        {
          statusIcon: <BuildRunning />,
          buildMessage: "Add transaction context to all queries",
          buildNumber: "124",
          author: {
            avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author2",
            name: "John Smith",
          },
          branch: "feature/payments",
          commitId: "e5f6g7h8",
          createdAt: "2024-07-24T10:45:00Z",
          timeElapsed: "2m",
        },
        {
          statusIcon: <BuildPassed />,
          buildMessage: "Add new feature for payments",
          buildNumber: "125",
          author: {
            avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author2",
            name: "John Smith",
          },
          branch: "feature/payments",
          commitId: "sdf8d10",
          createdAt: "2024-07-24T10:45:00Z",
          timeElapsed: "17m",
        },
      ],
    };

    render(<PipelineFetchComponent pipeline={pipeline} />);

    const buildMessage = await screen.findByText("Fix issue with user login");
    const buildNumber = screen.getByText("#123");
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
