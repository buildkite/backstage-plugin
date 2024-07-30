export type Status =
  | "CANCELED"
  | "CANCELING"
  | "CREATING"
  | "FAILED"
  | "FAILING"
  | "NOT_RUN"
  | "BLOCKED"
  | "UNBLOCKED"
  | "PAUSED"
  | "CONTINUE"
  | "PASSED"
  | "RUNNING"
  | "SCHEDULED"
  | "SKIPPED"
  | "WAIT"
  | "WAITER"
  | "WAITING"
  | "ACCEPTED"
  | "ASSIGNED"
  | "LIMITED"
  | "LIMITING"
  | "WAITING_FAILED"
  | "TIMING_OUT"
  | "Undetermined";

export type BuildParams = {
  status: Status;
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
  title?: string;
  command?: string;
  icon?: string;
  status: Status;
  url?: string;
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
