import { useState, useEffect, useCallback } from "react";
import { mockPipelines } from "../mockData";

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
  navatarColor: string;
  navatarImage: string;
  builds: BuildParams[];
};

export const useBuilds = (pipelineSlug: string, buildNumber: string) => {
  const [build, setBuild] = useState<BuildParams | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBuild = useCallback(() => {
    setLoading(true);
    const pipeline = mockPipelines.find((p) => p.name === pipelineSlug);
    if (pipeline) {
      const build = pipeline.builds.find((b) => b.buildNumber === buildNumber);
      setBuild(build || null);
    }
    setLoading(false);
  }, [pipelineSlug, buildNumber]);

  useEffect(() => {
    fetchBuild();
  }, [fetchBuild]);

  return { build, loading };
};
