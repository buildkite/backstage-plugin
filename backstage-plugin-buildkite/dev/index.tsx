import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { buildkitePlugin, BuildkitePage } from '../src/plugin';

createDevApp()
  .registerPlugin(buildkitePlugin)
  .addPage({
    element: <BuildkitePage />,
    title: 'Root Page',
    path: '/buildkite',
  })
  .render();
