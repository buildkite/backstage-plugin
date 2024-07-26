export type BuildParams = {
  statusIcon: React.ReactElement;
  buildMessage: string;
  buildNumber: string;
  author: {
    avatar: string;
    name: string;
  };
  branch: string;
  commitId: string;
  createdAt: string;
  timeElapsed: string;
  steps: BuildStepParams[];
};

export type BuildStepParams = {
  id: string;
  title: string;
  icon: string;
  status: "passed" | "failed" | "running";
  url: string;
};

export type PipelineParams = {
  name: string;
  id: string;
  navatarColor: string;
  navatarImage: string;
  builds: BuildParams[];
};

export type ComponentParams = {
  name: string;
  id: string;
  navatarColor: string;
  navatarImage: string;
  pipelines: PipelineParams[];
};
