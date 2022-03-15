const { request }                     = require( "http" );
const { createGzip }                  = require( "zlib" );
const { createReadStream }            = require( "fs" );
const { basename }                    = require( "path" );
const { createCipheriv, randomBytes } = require( "crypto" );

const filepath = "sent-files/" + process.argv[2];
const secret   = Buffer.from( process.argv[3], "hex" );

const initVector = randomBytes( 16 );

const httpRequestOptions = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "PUT",
  headers: {
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "gzip",
    "X-Filename": basename( filepath ),
    "X-Initialization-Vector": initVector.toString( "hex" ),
  },
};

const req = request( httpRequestOptions, ( res ) => {
  console.log( `Server response: ${res.statusCode}` );
} );

createReadStream( filepath )
  .pipe( createGzip() )
  .pipe( createCipheriv( "aes192", secret, initVector ) )
  .pipe( req )
  .on( "finish", () => {
    console.log( "File sent successfully" );

    process.exit( 0 );
  } );
