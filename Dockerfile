# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Migration
RUN npx prisma migrate dev

# Add environment variables for Next.js telemetry and build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application with error output
RUN npm run build || (cat .next/error.log && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]