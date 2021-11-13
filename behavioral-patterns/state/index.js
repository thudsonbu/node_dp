const JSONServer = require('./classes/json-tcp-server');

async function main() {

  const server = new JSONServer;

  await server.connect( 6000 );

  
}
