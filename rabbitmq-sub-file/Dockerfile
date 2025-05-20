FROM node:20

# create app directory
WORKDIR /rabbitmq-sub-file

# Install app dependencies
COPY rabbitmq-sub-file/package.json ./

RUN rm -rf node_modules package-lock.json && npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY rabbitmq-sub-file/ .

CMD [ "node", "index.js" ]