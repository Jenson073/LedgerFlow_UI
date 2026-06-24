# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /src

# Copy dependency configuration files
COPY package.json package-lock.json ./

# Install dependencies including devDependencies (needed to build Nuxt application)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the production application
RUN npm run build

# Stage 2: Production run stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set node environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy the built output server from the builder stage
COPY --from=builder /src/.output /app/.output

# Expose port
EXPOSE 3000

# Start server
CMD ["node", ".output/server/index.mjs"]
