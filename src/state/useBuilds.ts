import { useState, useEffect, useCallback } from "react";
import { mockPipelines } from "../mockData";
import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
} from "../components/Types";

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
