import { useState, useEffect, useCallback } from "react";
import { mockPipelines } from "../mockData";
import { PipelineParams } from "../components/Types";

export const usePipeline = (pipelineSlug: string) => {
  const [pipeline, setPipeline] = useState<PipelineParams | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPipeline = useCallback(() => {
    setLoading(true);
    const foundPipeline = mockPipelines.find((p) => p.name === pipelineSlug);
    if (foundPipeline) {
      setPipeline(foundPipeline);
    } else {
      setPipeline(null);
    }
    setLoading(false);
  }, [pipelineSlug]);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  return { pipeline, loading };
};
