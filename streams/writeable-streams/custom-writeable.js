const { Writeable } = require("stream");
const fs = require("fs");
const { dirname } = require("path");
const mkdirp = require("mkdirp-promise");

export class ToFileStream extends Writeable {
  constructor(options) {
    // setting object mode will automatically handle maintaining objects
    super({ ...options, objectMode: true });
  }

  // write is an a private method that must be implemented by a class implementing
  // the writeable interface
  _write(chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.promises.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb);
  }
}
