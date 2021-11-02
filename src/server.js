'use strict';
const logger = require('../helpers/log-provider');
var { verb, status } = require('../helpers/constants');
const net = require('net');

const port = 8099;
const host = '0.0.0.0';//'localhost';
const server = net.createServer();
const arrayData = [];

server.listen(port, host, () => {
  console.log(`TCP server listening on ${host}:${port}`);
  logger.info(`TCP server listening on ${host}:${port}`);
});
let sockets = [];
server.on('connection', (socket) => {
  var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new client connected: ${clientAddress}`);
  logger.info(`new client connected: ${clientAddress}`);

  //sockets.push(socket);
  socket.on('data', (data) => {
    console.log(`Client ${clientAddress}`);   // Write the data back to all the connected, the client will receive it as data from the server 

    const doaSync = async () => {
      const result = await Run(data.toString());
      socket.write(result);
    };
    doaSync();

  });
  // Add a 'close' event handler to this instance of socket 
  socket.on('close', (data) => {
    // let index = sockets.findIndex((o) => {
    //   return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
    // })
    // if (index !== -1) sockets.splice(index, 1);
    // sockets.forEach((sock) => {
    //   sock.write(`${clientAddress} disconnected\n`);
    // });
    console.log(`connection closed: ${clientAddress}`);
    logger.info(`connection closed: ${clientAddress}`);
  });
  // Add a 'error' event handler to this instance of socket 
  socket.on('error', (err) => {
    console.log(`Error occurred in ${clientAddress}: ${err.message}`);
    logger.info(`Error occurred in ${clientAddress}: ${err.message}`);
  });
});


const Run = async message => {

  const verbAndPredicate = message.split(':');

  if (verbAndPredicate.length != 2) {
    return status.FAIL;
  }
  console.log(`Verb = ${ verbAndPredicate[0]}`);
  console.log(`predicate = ${ verbAndPredicate[1]}`);
  
  

  var verb = verbAndPredicate[0];
  var predicate = verbAndPredicate[1].replace('\n', '');  
  var predicateWithoutNoise = predicate.replace(' ', '');
  
  if (verb === "QUERY") {

    let resp = arrayData.find(el => el.name === predicateWithoutNoise);
    let resp1 = arrayData.find(x => x.name === predicateWithoutNoise)

    if (typeof resp === 'undefined') {   
      arrayData.push({ "name": predicateWithoutNoise.toString(), "status": "FREE" })  
      return status.FREE;
    }
    else if (resp.status === "FREE") {     
      return status.FREE;
    } else if (resp.status === "RESERVED") {
      return status.RESERVED
    } else {
      return status.SOLD;
    }
  }
  else if (verb == "RESERVE") {

    let resp = arrayData.find(el => el.name === predicateWithoutNoise);
    if (typeof resp === 'undefined') {
      //console.log(`É UNDEFINED : `);
    }
    else if (resp.status === "FREE") {

      const index = arrayData.findIndex((element, index) => {
        if (element.name === predicateWithoutNoise) {
          return true;
        }
      });
      arrayData[index].status = "RESERVED";

      return status.OK;
    }
    return status.FAIL;
  }
  else if (verb == "BUY") {

    let resp = arrayData.find(el => el.name === predicateWithoutNoise);
    if (typeof resp === 'undefined') {
      //console.log(`É UNDEFINED : `);
    }
    else if (resp.status === "RESERVED") {

      const index = arrayData.findIndex((element, index) => {
        if (element.name === predicateWithoutNoise) {
          return true;
        }
      });
      arrayData[index].status = "SOLD";

      return status.OK;
    }
    return status.FAIL;
  }

  return status.FAIL;
};