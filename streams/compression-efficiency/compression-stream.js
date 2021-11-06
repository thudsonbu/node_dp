const {
  createBrotliCompress,
  createGzip,
  createDeflate,
} = require('zlib');

const {
  createReadStream,
  createWriteStream
} = require('fs');

const readline = require('readline');
const path     = require('path');

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout
});


function compress( filename, algorithm = '' ) {

  return new Promise( ( resolve, reject ) => {

    const inputFilepath = path.join(
      __dirname,
      './input',
      filename
    );

    const outputFilepath = path.join(
      __dirname,
      './output',
      filename + '.bin'
    );

    const compressionAlgorithm = determineMethod( algorithm );

    const inputStream          = createReadStream( inputFilepath );

    console.time('compression-test');

    inputStream
      .pipe( compressionAlgorithm() )
      .pipe( createWriteStream( outputFilepath ) )
      .on( "finish", () => {

        console.log( "compression successful" );
        console.timeEnd('compression-test');

        resolve();
      }).on( "error", ( err ) => {

        console.log( err.message );
        reject( err );
      });
  });
}

function determineMethod( algorithm ) {

  if ( algorithm === 'brotli' ) {
    return createBrotliCompress;
  } else if ( algorithm === 'deflate' ) {
    return createDeflate;
  } else {
    return createGzip;
  }
}

function getUserInput( query ) {

  return new Promise( (resolve, reject) => {

    rl.question( query, ( response ) => {
      resolve( response );
    });

  });
}

async function main() {

  const filename = await getUserInput(
    'enter the name of the file in ./input that you would like to compress:\n'
  );

  const algorithm = await getUserInput(
    'compression algorithm ( brotli, deflate, gzip ):\n'
  );

  rl.close();

  console.log( 'compressing...' );

  await compress( filename, algorithm );

  process.exit( 0 );
}

main()
  .then( () => {
    console.log('done');
  })
  .catch( err => {
    console.log( err.message );
  });
