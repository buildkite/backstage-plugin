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
  id: string;
  navatarColor: string;
  navatarImage: string;
  builds: BuildParams[];
};

export const useBuilds = (pipelineSlug: string, buildNumber: string) => {
  const [pipeline, setPipeline] = useState<PipelineParams | null>(null);
  const [build, setBuild] = useState<BuildParams | null>(null);
  const [steps, setSteps] = useState<BuildStepParams[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuild = useCallback(() => {
    setLoading(true);
    const foundPipeline = mockPipelines.find((p) => p.name === pipelineSlug);
    if (foundPipeline) {
      const foundBuild = foundPipeline.builds.find(
        (b) => b.buildNumber === buildNumber
      );
      setPipeline(foundPipeline);
      setBuild(foundBuild || null);
      setSteps(foundBuild ? foundBuild.steps : []);
    }
    setLoading(false);
  }, [pipelineSlug, buildNumber]);

  useEffect(() => {
    fetchBuild();
  }, [fetchBuild]);

  return { pipeline, build, steps, loading };
};
