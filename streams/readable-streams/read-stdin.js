/**
 * Reads from standard output, ie. run this file with node read-stdin.js and
 * ever time you type something into the console while it is running and press
 * enter it will receive the data that you write.
 */

process.stdin
  .on( "readable", () => {
    console.log( "New data!" );

    let chunk;
    while( ( chunk = process.stdin.read() ) !== null ) {
      console.log( "Read chunk: " + chunk.toString() );
    }
  } )
  .on( "end", () => {
    console.log( "End" );
  } );
