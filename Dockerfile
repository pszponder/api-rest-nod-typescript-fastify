# https://docs.docker.com/get-started
# https://dev.to/davydocsurg/mastering-docker-for-nodejs-advanced-techniques-and-best-practices-55m9
# https://medium.com/@alpercitak/nest-js-use-pnpm-on-docker-81998ab4d8a1

# Initialize new Build Stage and set Base Image
FROM node:18-alpine

# Set (and optionally create) the working directory
# This automatically changes the working directory to specified file path
WORKDIR /app

# Install PNPM (https://pnpm.io/installation)
RUN npm install -g pnpm

# Copy into working directory only the required packages to install application dependencies
COPY package*.json pnpm-lock.yaml ./

# Install only production dependencies with PNPM
RUN pnpm install --prod

# Copy the source code into the working directory
COPY . .

# Build the application (Transpile TypeScript into JavaScript)
RUN pnpm build-prod

# Start the Application
CMD ["pnpm", "start"]