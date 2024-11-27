import React from 'react';
import { Button } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getBuildkiteProjectSlug, parseBuildkiteProjectSlug } from '../../utils';

interface ExternalBuildButtonProps {
  buildNumber: string;
}

export const ExternalBuildButton: React.FC<ExternalBuildButtonProps> = ({ buildNumber }) => {
  const { entity } = useEntity();
  
  const projectSlug = getBuildkiteProjectSlug(entity);
  const { organizationSlug, pipelineSlug } = parseBuildkiteProjectSlug(projectSlug);
  
  const buildkiteUrl = `https://buildkite.com/${organizationSlug}/${pipelineSlug}/builds/${buildNumber}`;

  return (
    <Button
      variant="text"
      size="small"
      endIcon={<OpenInNewIcon />}
      href={buildkiteUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      View in Buildkite
    </Button>
  );
};
