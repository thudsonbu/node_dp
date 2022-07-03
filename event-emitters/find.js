const { Transform } = require('stream');

class Find extends Transform {
  constructor( id ) {
    super();

    this.id       = id;
    this.buffer   = '';
    this.data     = '';
  }

  async _transform( chunk, encoding, callback ) {
    this.buffer += chunk;

    const index            = this.buffer.indexOf( this.id );
    const data_start_index = index + this.id.length + 3;

    if ( this.buffer.length > data_start_index ) {
      this.data = this.buffer.slice( data_start_index );

      const delimiter_index = this.data.search(':::');

      this.data = this.data.substring( 0, delimiter_index );
    }

    callback();
  }

  async _flush( callback ) {
    this.push( this.data );

    this.emit( 'result', this.data );

    callback();
  }
}

module.exports = Find;
