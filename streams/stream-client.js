const { request }          = require('http');
const { createGzip }       = require('zlib');
const { createReadStream } = require('fs');
const { basename }         = require('path');

const filename   = process.argv[2];
const serverHost = process.argv[3];

const httpRequestOptions = {
  hostname: serverHost,
  port:     3000,
  path:     '/',
  method:   'PUT',
  headers:  {
    'Content-Type':     'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename':       basename( filename )
  }
};

const req = request( httpRequestOptions, ( res ) => {
  console.log( `Server response: ${res.statusCode}` );
});

createReadStream( filename )
  .pipe( createGzip() )
  .pipe( req )
  .on( 'finish', () => {
    console.log( 'File sent succesfully' );
  });
