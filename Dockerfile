FROM node:20

WORKDIR /app

# Install global dependencies
RUN npm install -g typescript@5.1.6 eslint-plugin-react-hooks@4.6.0

# Copy package.json and tsconfig.json first to leverage Docker caching
COPY package.json tsconfig.json ./

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set entrypoint to our script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command keeps the container running for development
CMD ["tail", "-f", "/dev/null"]