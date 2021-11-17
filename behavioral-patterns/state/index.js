const JSONServer = require('./classes/json-tcp-server');

function main() {

  return new Promise( function( resolve, reject ) {

    

  });

  const server = new JSONServer;

  console.log( 'connecting server' );
  await server.connect( 6000 );
}

main();
