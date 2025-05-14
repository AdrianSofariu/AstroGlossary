# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm uninstall @types/axios

# Copy the rest of your application
COPY . .

# Build the Next.js app
RUN npm run build

# Start the app
CMD ["npm", "start"]
