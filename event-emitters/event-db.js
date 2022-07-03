const EventEmitter = require('events');
const fs           = require('fs/promises');
const crypto       = require('crypto');
const { pipeline } = require('node:stream/promises');
const Find         = require('./find');

class EventDB extends EventEmitter {
  constructor( name ) {
    super();

    this.name      = name;
    this.file_path = `./${ this.name }`;
  }

  async find( id ) {
    const find = new Find( id );

    find.on( 'result', r => {
      this.emit( 'result', r );
    });

    await pipeline(
      fs.readFile( this.file_path, { encoding: 'utf-8' } ),
      find
    );
  }

  async insert( data ) {
    const id           = crypto.randomUUID();
    const data_with_id = `${ id }:::${ data }:::`;

    await fs.writeFile(
      this.file_path,
      data_with_id,
      { encoding: 'utf-8', flag: 'a' }
    );

    this.emit( id, data );

    return { id, data };
  };
};

module.exports = EventDB;
