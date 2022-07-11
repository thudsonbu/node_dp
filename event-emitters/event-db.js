const EventEmitter         = require('node:events');
const fs                   = require('node:fs/promises');
const path                 = require('node:path');
const crypto               = require('node:crypto');
const { pipeline }         = require('node:stream/promises');
const Find                 = require('./streams/find-stream');
const createDocumentString = require('./utils/create-document-string');

/**
 * Database document
 * @typedef {Object} Document
 * @property {string} id - id of document
 * @property {string} data - data of document
 */

/**
 * Change event.
 * @event EventDB#change
 * @type {Document}
 */

/**
 * Core database class
 */
class EventDB extends EventEmitter {
  constructor( name, opts ) {
    super();

    this.dataDelimiter     = opts?.dataDelimiter || '::::';
    this.documentDelimiter = opts?.documentDelimiter || '\n';

    if ( this.dataDelimiter === this.documentDelimiter ) {
      throw new Error('dataDelimiter must not equal documentDelimiter');
    }

    this.name     = name;
    this.filesDir = path.resolve( __dirname, `./db-files` );

    // It is required that we create a unique filename as each time the
    // compaction process is completed the database will begin referencing a
    // new file with the compacted contents of the previous file.
    this.fileName = crypto.randomUUID();
    this.filePath = `${ this.filesDir }/${ this.fileName }`;
  }

  /**
   * Find a document by its id
   *
   * @param {string} id - id to search with
   *
   * @emits EventDB#change
   *
   * @returns {Promise<Document>}
   */
  async findById( id ) {
    return new Promise( ( resolve, reject ) => {
      const find = new Find( id, this.dataDelimiter, this.documentDelimiter );

      find.on( 'find', data => {
        const returnValue = { id, data };

        this.emit( 'find', returnValue );
        resolve( returnValue );
      });

      find.on( 'not found', () => {
        this.emit('not found');
        reject('not found');
      });

      pipeline(
        fs.readFile( this.filePath, { encoding: 'utf-8' } ),
        find
      );
    });
  }

  /**
   * Insert a document into the db
   *
   * @param {string} data - data to be inserted
   *
   * @emits EventDB#change
   *
   * @returns {Promise<Document>}
   */
  async insert( data ) {
    const { documentString, id } = createDocumentString( data );

    await fs.writeFile(
      this.filePath,
      documentString,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { id, data };

    this.emit( 'insert', returnValue );

    return returnValue;
  };

  /**
   * Insert multiple documents into the db
   *
   * @param {string[]} data - data to be inserted
   *
   * @typedef {Object} InsertManyResult
   * @property {Document[]} results - insert results in order
   * @property {number} count - number of items inserted
   *
   * @returns {Promise<InsertManyResult>}
   */
  async insertMany( data ) {
    let blob = '';

    const results = data.map( d => {
      const { documentString, id, data } = createDocumentString( d );

      blob += documentString;

      return { id, data };
    });

    await fs.writeFile(
      this.filePath,
      blob,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { results, count: results.length };

    this.emit( 'insertMany', returnValue );

    return returnValue;
  }

  /**
   * Update a document by id, this is as simple as appending to the log as only
   * the most recent value is processed
   *
   * @param {string} id - id of document to update
   */
  async updateById( id, data ) {
    const { documentString } = createDocumentString( data, id );

    await fs.writeFile(
      this.filePath,
      documentString,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { id, data };

    this.emit( 'update', returnValue );

    return returnValue;
  }
};

module.exports = EventDB;
