FROM andersonac25/node-express:latest
# FROM node:latest

RUN mkdir -p /home/src/app/node_modules && chown -R root:root /home/src/app

# Create app directory
WORKDIR /home/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# RUN npm install -g npm  && \
 #    npm install  && \
#     npm install -g nodemon && \
 #    npm install -g net 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
 COPY . .

#COPY –chown=node:node ..

USER root

EXPOSE 8099
CMD [ "npm", "start" ]