const net = require('net');
const url = require('url');
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });


const port = process.env.PORT;
const host = process.env.HOST;//localhost

describe('Network Test: ', function() {
    let conn = false;
    let dataSend = false;

   console.log(`${process.env.NODE_ENV}`);
    //Test client connection
    const client = net.createConnection({ port: port, host: host }, () => {       
        // 'connect' listener.
        conn = true;
    });  
    
    client.on('data', (data) => {
        console.log("data.toString()");
        console.log(data.toString());
        client.end();
        dataSend = true
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });

    it('Error connecting to server', function () {
        expect(conn).toBe(true);
    });
})