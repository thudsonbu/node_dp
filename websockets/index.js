const http            = require('http');
const WebSocketServer = require('websocket').server;

// create base http server
const server = http.createServer( ( req, res ) => {
  console.log('we have received a request');
});

const websocket = new WebSocketServer({
  // provide http server that the websocket server will use the tcp socket
  // from
  'httpServer': server
});

websocket.on('request');

server.listen( 3005, () => {
  console.log('server listening on port 3005');
});
