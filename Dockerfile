# Use the official Node.js image from the Docker Hub
FROM node:22

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Define the command to run your application
CMD [ "node", "app.js" ]

