const stream = require("stream");

class CSVParse extends stream.Transform {
  constructor(options) {
    options.objectMode = true;
    super({ ...options });
    this.properties = [];
    this.tail = "";
  }

  _transform(chunk, encoding, callback) {
    let cleanCut = chunk.endsWith("\n");
    let lines = (this.tail + chunk).split("\n");

    if (!cleanCut) {
      this.tail = lines.pop();
    } else {
      this.tail = "";
    }

    if (!this.properties.length && lines.length > 0) {
      this.properties = lines.shift().split(",");
    }

    lines.forEach((line) => {
      if (line.length) {
        let object = {};
        let datum = line.split(",");

        for (let i = 0; i < this.properties.length; i++) {
          object[this.properties[i]] = datum[i];
        }

        this.push();
      }
    });

    callback();
  }

  _flush(callback) {
    callback();
  }
}

module.exports = CSVParse;
