# Use official Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 8000

# Command to run the app
CMD ["node", "server.js"]
