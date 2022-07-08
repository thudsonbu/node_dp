const { Transform } = require('stream');

class Find extends Transform {
  constructor( id, dataDelimiter, documentDelimiter ) {
    super();

    this.id                = id;
    this.dataDelimiter     = dataDelimiter;
    this.documentDelimiter = documentDelimiter;
    this.tail              = '';
    this.found             = '';
  }

  async _transform( chunk, encoding, callback ) {
    this.tail += chunk;

    const docs = this.tail.split( this.documentDelimiter );

    // the last doc may be incomplete so save it until next chunk is added on
    // if it is the very last doc it will be handled in _flush
    this.tail = docs.pop();

    docs.forEach( d => {
      const [ id, data ] = d.split( this.dataDelimiter );

      // we want the latest record for an id so we overwrite old versions
      if ( id === this.id ) {
        this.found = data;
      }
    });

    callback();
  }

  async _flush( callback ) {
    const [ id, data ] = this.tail.split( this.dataDelimiter );

    if ( id === this.id ) {
      this.found = data;
    }

    if ( this.found ) {
      this.emit( 'find', this.found );
    } else {
      this.emit('not found');
    }

    callback();
  }
}

module.exports = Find;
