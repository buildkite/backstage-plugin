import { useState, useEffect } from "react";
import { mockPipelines } from "../mockData";
import { PipelineParams } from "./useBuild";

export const usePipelines = () => {
  const [pipelines, setPipelines] = useState<PipelineParams[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPipelines(mockPipelines);
    setLoading(false);
  }, []);

  return { pipelines, loading };
};
