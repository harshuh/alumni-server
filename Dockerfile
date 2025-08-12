# Use a lightweight Node image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app


# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies (only production deps)
RUN npm install 

# Copy rest of the source code
COPY . .

# Set environment variables (optional, can also be in .env file)
# ENV NODE_ENV=production

# Expose app port (must match your app's port)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
