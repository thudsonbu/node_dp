const fs               = require('node:fs');
const { pipeline }     = require('node:stream/promises');
const EventEmitter     = require('node:events');
const crypto           = require('node:crypto');
const path             = require('node:path');
const DBReader         = require('./streams/db-read-stream');
const CompactionStream = require('./streams/compaction-stream');


/**
 * The Compactor performs compaction of the database log removing old keys. It
 * listen to and records update events and then removes out of date keys during
 * downtime.
 */
class Compactor extends EventEmitter {
  constructor( opts ) {
    super();
    // The updateLog is a map from the document id to the number of updates
    // that the document has received since the last compaction. This is how
    // many occurrences of a given id can be removed during compaction.
    this.updateLog = new Map();

    this.lock               = opts.lock;
    this.filesDir           = opts.filesDir;
    this.fileName           = opts.fileName;
    this.compactionInterval = opts.compactionInterval || 30e3;
    this.running            = false;
    this.dataDelimiter      = opts.dataDelimiter;
    this.documentDelimiter  = opts.documentDelimiter;

    this.dbReader = new DBReader(
      opts.dataDelimiter,
      opts.documentDelimiter
    );
  }

  /**
   * Perform compaction on the database file by removing keys that were recorded
   * in the updateLog.
   */
  async compact() {
    const release = await this.lock.acquire();

    const filePath = path.resolve(
      __dirname,
      `${ this.filesDir }/${ this.fileName }`
    );

    const newFilePath = path.resolve(
      __dirname,
      `${ this.filesDir }/${ crypto.randomUUID() }`
    );

    const compactionStream = new CompactionStream({
      updateLog: this.updateLog,
      dataDelimiter: this.dataDelimiter,
      documentDelimiter: this.documentDelimiter
    });

    await pipeline(
      fs.createReadStream( filePath ),
      this.dbReader,
      compactionStream,
      fs.createWriteStream( newFilePath )
    );

    release();

    this.emit( 'compacted', { newFilePath } );
  }

  /**
   * Recursively call the compact function on a cycle.
   */
  async compactRecursive() {
    await this.compact();

    // Add jitter so that compaction cycles cannot converge between multiple
    // processes.
    const jitter = Math.random() * 5000;

    setTimeout( () => {
      if ( this.running ) {
        this.compactRecursive();
      } else {
        this.emit('stopped');
      }

    }, this.compactionInterval + jitter );
  }

  /**
   * Add an update to the updateLog for use during the next compaction cycle.
   */
  recordUpdate( update ) {
    if ( this.updateLog.has( update.id ) ) {
      const currentCount = this.updateLog.get( update.id );
      this.updateLog.set( update.id, currentCount + 1 );
    } else {
      this.updateLog.set( update.id, 1 );
    }
  }

  /**
   * Start the database compactor
   */
  async start() {
    this.running = true;

    this.emit('started');

    this.compactRecursive();
  }

  /**
   * Stop the Compactor
   */
  async stop() {
    this.running = false;
  }
}

module.exports = Compactor;
