const {
  createBrotliCompress,
  createBrotliDecompress,
  createGzip,
  createGunzip,
  createDeflate,
  createInflate
} = require('zlib');

const {
  createReadStream,
  createWriteStream
} = require('fs');

const path = require('path');

const inputFilepath = path.join(
  __dirname,
  './input/message.txt'
);

const outputFilepath = path.join(
  __dirname,
  './output/message.bin'
);

const inputStream = createReadStream( inputFilepath );

inputStream
  .pipe( createBrotliCompress() )
  .pipe( createWriteStream( outputFilepath ) )
  .on( "finish", () => {
    console.log( "compression successful" );
    process.exit( 0 );
  })
  .on( "error", ( err ) => {
    console.log( err.message );
    process.exit( 1 );
  });
