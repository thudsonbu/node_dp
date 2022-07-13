const { Transform } = require('node:stream');

/**
 * The DBReader take in output from a read stream of a database file and
 * organizes it into individual documents. It emits a single data event per
 * document.
 */
class DBReader extends Transform {
  constructor( dataDelimiter, documentDelimiter ) {
    super({ readableObjectMode: true });

    this.dataDelimiter     = dataDelimiter;
    this.documentDelimiter = documentDelimiter;
    this.tail              = '';
  }

  async _transform( chunk, encoding, callback ) {
    this.tail += chunk;

    const docs = this.tail.split( this.documentDelimiter );

    // The last doc may be incomplete so save it until next chunk is added on
    // if it is the very last doc it will be handled in _flush.
    this.tail = docs.pop();

    docs.forEach( d => {
      const [ id, data ] = d.split( this.dataDelimiter );
      this.push({ id, data });
    });

    callback();
  }

  async _flush( callback ) {
    if ( this.tail.length ) {
      const [ id, data ] = this.tail.split( this.dataDelimiter );

      this.push({ id, data });
    }

    callback();
  }
}

module.exports = DBReader;
