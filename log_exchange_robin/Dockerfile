FROM node:20

# create app directory
WORKDIR /log_exchange_robin

# Install app dependencies
COPY log_exchange_robin/package.json .

RUN rm -rf node_modules package-lock.json && npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY log_exchange_robin/ .

CMD [ "node", "producer.controller.js" ]