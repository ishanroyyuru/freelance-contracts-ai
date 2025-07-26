# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app’s source code
COPY . .

# Expose the port your app listens on
EXPOSE 5001

# Default command to run your app
CMD ["npm", "start"]
