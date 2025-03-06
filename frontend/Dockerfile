FROM node:20

# create app directory
WORKDIR /frontend

# Install app dependencies
COPY frontend/package.json ./

RUN rm -rf node_modules package-lock.json && npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY frontend/ .

# Expose the port used by Vite (default is 5173)
EXPOSE 5173

# Set the command to run the development server
CMD ["npm", "run", "dev"]