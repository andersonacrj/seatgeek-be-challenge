'use strict';
const logger = require('../helpers/log-provider');
const net = require('net');
const { Run } = require('../services/wire_protocol');
const dotenv = require("dotenv");
const path = require("path");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = 8099;
const host = '0.0.0.0';//'localhost';
const server = net.createServer();

  server.listen(port, host, () => {
    console.log(`TCP server listening on ${host}:${port}`);
    logger.info(`TCP server listening on ${host}:${port}`);
  });
  let sockets = [];
  server.on('connection', async (socket) => {
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`new client connected: ${clientAddress}`);
    logger.info(`new client connected: ${clientAddress}`);

    //sockets.push(socket);
      socket.on('data', async (data) => {
      console.log(`Client ${clientAddress}`);   // Write the data back to all the connected, the client will receive it as data from the server 

        const result = await Run(data.toString());
        socket.write(result);
    });
    // Add a 'close' event handler to this instance of socket 
    socket.on('close', async  (data) => {
      console.log(`connection closed: ${clientAddress}`);
      logger.info(`connection closed: ${clientAddress}`);
    });
    // Add a 'error' event handler to this instance of socket 
    socket.on('error', async  (err) => {
      console.log(`Error occurred in ${clientAddress}: ${err.message}`);
      logger.info(`Error occurred in ${clientAddress}: ${err.message}`);
    });

  });
