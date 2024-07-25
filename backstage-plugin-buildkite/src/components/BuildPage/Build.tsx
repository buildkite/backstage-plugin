import React from "react";
import { useParams } from "react-router-dom";

export const BuildPage = () => {
  const params = useParams();
  return (
    <div>
      <h1>Build page</h1>
      <ul>
        <li>pipelineSlug: {params.pipelineSlug}</li>
        <li>buildNumber: {params.buildNumber}</li>
      </ul>
    </div>
  );
};
