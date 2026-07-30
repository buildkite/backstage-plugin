#!/bin/bash
set -e

# Install from the lockfile when the Backstage CLI is missing. --production=false
# is required because the build service sets NODE_ENV=production, which makes
# yarn skip devDependencies, and @backstage/cli is one of them.
if [ -f "package.json" ] && [ ! -x "node_modules/.bin/backstage-cli" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile --production=false
fi

# Execute the command passed to the script
exec "$@"