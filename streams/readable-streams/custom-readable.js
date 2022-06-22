const { Readable } = require('stream');
const Chance       = require('chance');

const chance = new Chance();

// custom readable prototype
class RandomStream extends Readable {
  constructor( options ) {
    super( options );
    this.emittedBytes = 0;
  }

  // _read is a method to be implemented by a child of the Readable prototype
  // but this function should be kept private as indicated by the leading
  // underscore
  _read( size ) {
    const chunk = chance.string({ length: size });

    this.push( chunk, 'utf-8' ); // encoding not necessary if buffer
    this.emittedBytes += chunk.length;

    if ( chance.bool({ likelihood: 5 }) ) {
      this.push( null );
    }
  }
}

module.exports = RandomStream;
