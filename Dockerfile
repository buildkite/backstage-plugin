FROM node:20

WORKDIR /app

# Install global dependencies
RUN npm install -g typescript@5.1.6 eslint-plugin-react-hooks@4.6.0 @backstage/cli

# We're using volume mounts in compose.yaml, so we need a script to:
# 1. Install dependencies if needed when container starts
# 2. Generate TypeScript declarations
# 3. Execute the command passed to the container

# Create entrypoint script
RUN echo '#!/bin/bash \n\
set -e \n\
\n\
# Install local dependencies if node_modules does not exist \n\
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then \n\
  echo "Installing dependencies..." \n\
  yarn install --frozen-lockfile \n\
fi \n\
\n\
# Generate TypeScript declaration files \n\
echo "Generating TypeScript declaration files..." \n\
npx tsc \n\
\n\
# Execute the command passed to the script \n\
exec "$@"' > /usr/local/bin/docker-entrypoint.sh \
&& chmod +x /usr/local/bin/docker-entrypoint.sh

# Set entrypoint to our script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default command keeps the container running for development
CMD ["tail", "-f", "/dev/null"]