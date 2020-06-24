const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const SensorDateParser = require('body-parser');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
	console.log("Acceleration:" + SensorDateParser(msg.toString()).acceleration_x);
	console.log("Proximity:" + SensorDateParser(msg.toString()).proximity);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening IP : ? Port :${address.port}`);
});

server.bind(5000, '192.135.120.30');
