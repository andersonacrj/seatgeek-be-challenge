FROM andersonac25/seatgeek-be-challenge:latest
# FROM node:latest

RUN mkdir -p /home/src/app/node_modules && chown -R root:root /home/src/app

# Create app directory
WORKDIR /home/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
 COPY . .

#COPY –chown=node:node ..

USER root

EXPOSE 8099
CMD [ "npm", "start" ]