const http            = require('http');
const WebSocketServer = require('websocket').server;

// create base http server
const httpServer = http.createServer( ( req, res ) => {
  console.log('we have received a request');
});

const wsServer = new WebSocketServer({
  httpServer
});

wsServer.on( 'connect', c => {
  console.log( `connected`, c );
});

let con;

wsServer.on( 'request', request => {
  // we decide to accept everything
  con = request.accept( null, request.origin );

  con.on( 'message', m => {
    console.log( `Received message ${ m.utf8Data }` );
  });

  con.on( 'close', () => {
    console.log('connection closed');
  });
});

httpServer.listen( 3005, () => {
  console.log('server listening on port 3005');
});
