import React from "react";
import { BuildFailed, BuildPassed, BuildRunning } from "../Icons";
import { Build } from "../PipelineComponent/PipelineComponent";

export type Pipeline = {
  name: string;
  navatarColor: string;
  navatarImage: string;
  builds: Build[];
};

export const pipelinesDummyData: Pipeline[] = [
  {
    name: "ads-promo-client",
    navatarColor: "#D1FAFF",
    navatarImage:
      "https://buildkiteassets.com/emojis/img-buildkite-64/react.png",
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
        steps: [
          {
            id: "step1",
            title: "Upload Pipeline",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/pipeline.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step2",
            title: "Build Docker Image",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/docker.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step3",
            title: "Linting",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/eslint.png",
            status: "running",
            url: "#",
          },
        ],
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
        steps: [
          {
            id: "step1",
            title: "Upload Pipeline",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/pipeline.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step2",
            title: "Build Docker Image",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/docker.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step3",
            title: "Linting",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/eslint.png",
            status: "running",
            url: "#",
          },
        ],
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
        steps: [
          {
            id: "step1",
            title: "Upload Pipeline",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/pipeline.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step2",
            title: "Build Docker Image",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/docker.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step3",
            title: "Linting",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/eslint.png",
            status: "running",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    name: "ads-promo-deploy",
    navatarColor: "#326DE6",
    navatarImage:
      "https://buildkiteassets.com/emojis/img-buildkite-64/kubernetes.png",
    builds: [
      {
        statusIcon: <BuildFailed />,
        buildMessage: "Fix issue with checkout",
        buildNumber: "201",
        author: {
          avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author3",
          name: "Alice Smith",
        },
        branch: "main",
        commitId: "b1c2d3e4",
        createdAt: "2024-07-24T11:23:00Z",
        timeElapsed: "45s",
        steps: [
          {
            id: "step1",
            title: "Upload Pipeline",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/pipeline.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step2",
            title: "Build Docker Image",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/docker.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step3",
            title: "Linting",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/eslint.png",
            status: "running",
            url: "#",
          },
        ],
      },
      {
        statusIcon: <BuildRunning />,
        buildMessage: "Add new payment gateway",
        buildNumber: "202",
        author: {
          avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author4",
          name: "Bob Johnson",
        },
        branch: "feature/payments",
        commitId: "f6g7h8i9",
        createdAt: "2024-07-24T12:45:00Z",
        timeElapsed: "5m",
        steps: [
          {
            id: "step1",
            title: "Upload Pipeline",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/pipeline.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step2",
            title: "Build Docker Image",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/docker.png",
            status: "passed",
            url: "#",
          },
          {
            id: "step3",
            title: "Linting",
            icon: "https://buildkiteassets.com/emojis/img-buildkite-64/eslint.png",
            status: "running",
            url: "#",
          },
        ],
      },
    ],
  },
];
