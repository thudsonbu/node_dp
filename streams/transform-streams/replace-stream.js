const stream = require('stream');

class ReplaceStream extends stream.Transform {
  constructor( searchStr, replaceStr, options ) {
    super({ ...options });
    this.searchStr = searchStr;
    this.replaceStr = replaceStr;
    this.tail = '';
  }

  _transform( chunk, encoding, callback ) {
    const pieces = ( this.tail + chunk ).split( this.searchStr );
    const lastPiece = pieces[ pieces.length - 1 ];
    const tailLen = this.searchStr.length - 1;

    this.tail = lastPiece.slice( -tailLen );

    pieces[ pieces.length - 1 ] = lastPiece.slice( 0, -tailLen );

    // pushes transformed chunk to internal read buffer
    this.push( pieces.join( this.replaceStr ) );

    callback();
  }

  _flush( callback ) {
    this.push( this.tail );
    callback();
  }
}

module.exports = ReplaceStream;
