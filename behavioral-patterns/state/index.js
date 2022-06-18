const JSONServer = require('./classes/json-tcp-server');

const server = new JSONServer;

server.connect( 6000 );
