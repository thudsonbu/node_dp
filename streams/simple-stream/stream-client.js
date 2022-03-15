const { request }                     = require( "http" );
const { createGzip }                  = require( "zlib" );
const { createReadStream }            = require( "fs" );
const { basename }                    = require( "path" );
const { createCipheriv, randomBytes } = require( "crypto" );

const filename   = process.argv[2];
const serverHost = process.argv[3];
const secret     = Buffer.from( process.argv[4], "hex" );

const initVector = randomBytes( 16 );

const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: "/",
  method: "PUT",
  headers: {
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "gzip",
    "X-Filename": basename( filename ),
    "X-Initialization-Vector": initVector.toString( "hex" ),
  },
};

const req = request( httpRequestOptions, ( res ) => {
  console.log( `Server response: ${res.statusCode}` );
} );

createReadStream( filename )
  .pipe( createGzip() )
  .pipe( createCipheriv( "aes192", secret, initVector ) )
  .pipe( req )
  .on( "finish", () => {
    console.log( "File sent successfully" );

    process.exit( 0 );
  } );
