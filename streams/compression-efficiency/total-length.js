const { Transform } = require('stream');


class TotalLength extends Transform {

  constructor( opts, prefix ) {
    super( opts );
    this.length = 0;
    this.prefix = prefix;
  }

  _transform( chunk, encoding, cb ) {
    this.length += chunk.length;
    this.push( chunk );
    cb();
  }

  _flush( cb ) {
    console.log( this.prefix, this.length );
    this.push();
    cb();
  }
}

module.exports = TotalLength;
