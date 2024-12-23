# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Expose the port on which the app will run
EXPOSE 3000

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Remove .env file if it exists
RUN rm -f .env
RUN npm run build

ENV NODE_ENV=production
RUN npm ci

# Start the server using the production build
CMD ["npm", "run", "start"]