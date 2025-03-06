FROM node:20

# create app directory
WORKDIR /backend

# Install app dependencies
COPY backend/package.json ./

RUN rm -rf node_modules package-lock.json && npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY backend/ .

EXPOSE 3000
CMD [ "node", "api.js" ]