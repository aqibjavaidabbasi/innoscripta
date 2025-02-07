# Description: Dockerfile for the frontend-news service
FROM node:alpine 

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json /app

# Install dependencies
RUN yarn install --legacy-peer-deps

# Copy the rest of the files
COPY .  /app

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]