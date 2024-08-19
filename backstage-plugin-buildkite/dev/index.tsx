import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { buildkitePlugin, BuildkiteViewerPage } from '../src/plugin';

createDevApp()
  .registerPlugin(buildkitePlugin)
  .addPage({
    element: <BuildkiteViewerPage />,
    title: 'Root Page',
    path: '/buildkite',
  })
  .render();
