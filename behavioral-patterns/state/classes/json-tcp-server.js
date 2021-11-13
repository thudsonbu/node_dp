const net = require('net');

class JSONServer {

  constructor() {
    this.con    = null;
    this.server = null;
  }

  async connect( port ) {

    await this.createServer();

    await this.listen( port );

    this.server.on( 'error', ( err ) => {
      throw err;
    });
  }

  createServer() {
    return new Promise( ( resolve, reject ) => {

      this.server = net.createServer( con => {
        console.log( 'server created' );
        this.con = con;

        con.on( 'end', () => {
          console.log('client disconnected');
          this.con = null;
        });

        resolve();
      });

    });
  }

  listen( port ) {
    return new Promise( ( resolve, reject ) => {

      this.server.listen( port, () => {
        console.log('listening on port: ' + port);

        resolve();
      });

    });
  }

  disconnect() {
    return new Promise( ( resolve, reject ) => {

      try {
        this.server.close( () => {
          console.log('disconnected');

          this.server = null;
          this.con = null;

          resolve();
        });
      } catch ( err ) {

        console.log( err.message );
      }

    });
  }

  sendJSON( json ) {

    if ( this.server && this.con ) {

      const data = JSON.stringify( json );

      this.con.write( data );
      this.con.pipe( this.con );

      console.log('data sent');

    } else {

      console.log('no client connected');
    }
  }
}

module.exports = JSONServer;
