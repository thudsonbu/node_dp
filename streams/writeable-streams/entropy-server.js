const { createServer } = require( "http" );
const Chance = require( "chance" );

const chance = new Chance();

const server = createServer( ( req, res ) => {
  res.writeHead( 200, { "Content-Type": "text/plain" } );

  function generateMore() {
    while ( chance.bool( { likelihood: 95 } ) ) {
      const randomChunk = chance.string( {
        length: 16 * 1024 - 1,
      } );

      // response object implements the writeable interface so if the recipient
      // returns false indicating backpressure it is captured here
      const shouldContinue = res.write( `${randomChunk}\n` );

      if ( !shouldContinue ) {
        console.log( "back-pressure" );

        return res.once( "drain", generateMore );
      }
    }
  }

  res.end( "\n\n" );
  res.on( "finish", () => console.log( "All data send" ) );
} );

// register listener for finished event on socket
server.listen( 8080, () => {
  console.log( "Server listening on localhost:8080" );
} );

// use curl localhost:8080 to test the server (after starting it)
