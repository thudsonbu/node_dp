const EventEmitter         = require('node:events');
const fs                   = require('node:fs/promises');
const path                 = require('node:path');
const crypto               = require('node:crypto');
const { pipeline }         = require('node:stream/promises');
const Find                 = require('./streams/find-stream');
const createDocumentString = require('./utils/create-document-string');
const Compactor            = require('./db-compactor');
const DBLock               = require('./db-lock');

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
  constructor( name, opts = {} ) {
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

    this.lock = new DBLock();

    this.compactor = new Compactor({
      filesDir: this.filesDir,
      fileName: this.fileName,
      dataDelimiter: this.dataDelimiter,
      documentDelimiter: this.documentDelimiter,
      lock: this.lock,
      compactionInterval: opts.compactionInterval || null
    });

    // When a compaction cycle is finished we need to migrate the db to use
    // the new file.
    this.compactor.on( 'compacted', ({ newFilePath }) => {
      this.filePath = newFilePath;
    });

    this.on( 'update', doc => this.compactor.recordUpdate( doc ) );
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
        fs.readFile( this.filePath ),
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
    // Since we are writing to the database, a lock must be acquired or this
    // change might be lost due to not being included in a compaction cycle.
    const release = await this.lock.acquire();

    const { documentString, id } = createDocumentString({
      data,
      dataDelimiter: this.dataDelimiter,
      documentDelimiter: this.documentDelimiter
    });

    await fs.writeFile(
      this.filePath,
      documentString,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { id, data };

    this.emit( 'insert', returnValue );

    release();

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
    // Since we are writing to the database, a lock must be acquired or this
    // change might be lost due to not being included in a compaction cycle.
    const release = await this.lock.acquire();

    let blob = '';

    const results = data.map( d => {
      const { documentString, id, data } = createDocumentString({
        data: d,
        documentDelimiter: this.documentDelimiter,
        dataDelimiter: this.dataDelimiter
      });

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

    release();

    return returnValue;
  }

  /**
   * Update a document by id, this is as simple as appending to the log as only
   * the most recent value is processed
   *
   * @param {string} id - id of document to update
   */
  async updateById( id, data ) {
    // Since we are writing to the database, a lock must be acquired or this
    // change might be lost due to not being included in a compaction cycle.
    const release = await this.lock.acquire();

    const { documentString } = createDocumentString({
      data,
      id,
      dataDelimiter: this.dataDelimiter,
      documentDelimiter: this.documentDelimiter
    });

    await fs.writeFile(
      this.filePath,
      documentString,
      { encoding: 'utf-8', flag: 'a' }
    );

    const returnValue = { id, data };

    this.emit( 'update', returnValue );

    release();

    return returnValue;
  }
};

module.exports = EventDB;
