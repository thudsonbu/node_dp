const EventEmitter = require('events');
const fs           = require('fs/promises');
const path         = require('path');
const crypto       = require('crypto');
const { pipeline } = require('node:stream/promises');
const Find         = require('./find-stream');

/**
 * Database document
 * @typedef {Object} Document
 * @property {string} id - id of document
 * @property {string} data - data of document
 */

/**
 * Insert event.
 * @event EventDB#insert
 * @type {Document}
 */

/**
 * Find event.
 * @event EventDB#find
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

    this.name      = name;
    this.file_path = path.resolve( __dirname, `./${ this.name }` );
  }

  /**
   * Find a document by its id
   *
   * @param {string} id - id to search with
   *
   * @emits EventDB#find
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
        fs.readFile( this.file_path, { encoding: 'utf-8' } ),
        find
      );
    });
  }

  /**
   * Insert a document into the db
   *
   * @param {string} data - data to be inserted
   *
   * @emits EventDB#insert
   *
   * @returns {Promise<Document>}
   */
  async insert( data ) {
    const { documentString, id } = this.createDocumentString( data );

    await fs.writeFile(
      this.file_path,
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
      const { documentString, id, data } = this.createDocumentString( d );

      blob += documentString;

      return { id, data };
    });

    await fs.writeFile(
      this.file_path,
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
    const { documentString } = this.createDocumentString( data, id );

    await fs.writeFile(
      this.file_path,
      documentString,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { id, data };

    this.emit( 'update', returnValue );

    return returnValue;
  }

  /**
   * Create a valid document string for storage in db
   *
   * @param {string} data - data of document to be created
   * @param {string} [id] - id of document
   *
   * @typedef {Object} CreateDocumentStringResult
   * @property {string} documentString- document valid document string
   * @property {string} id - id in documentString
   * @property {string} data - data in documentString
   *
   * @returns {CreateDocumentStringResult}
   */
  createDocumentString( data, id ) {
    const documentId = !!id ? id : crypto.randomUUID();

    return {
      documentString: `${ documentId }${ this.dataDelimiter }${ data }${ this.documentDelimiter }`, // eslint-disable-line max-len
      id: documentId,
      data
    };
  }
};

module.exports = EventDB;
