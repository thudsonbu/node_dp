const { Writable } = require("stream");
const mkdir = require("fs");
const { dirname } = require("path");

class ToFileStream extends Writable {
  constructor(options) {
    // setting object mode will automatically handle maintaining objects
    super({ ...options, objectMode: true });
  }

  // write is a private method that must be implemented by a class implementing
  // the writeable interface
  _write(chunk, encoding, cb) {
    mkdir(dirname(chunk.path))
      .then(() => fs.promises.writeFile(chunk.path, chunk.content))
      .then(cb())
      .catch(cb);
  }
}

module.exports = ToFileStream;
