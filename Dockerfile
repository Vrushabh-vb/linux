# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend code to the container
COPY . .

# Expose the port your Express server runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
