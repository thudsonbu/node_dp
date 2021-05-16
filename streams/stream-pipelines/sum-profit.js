const stream = require("stream");

class SumProfit extends stream.Transform {
  constructor({ ...options }) {
    options.objectMode = true;
    super(options);
    this.sum = 0;
  }

  _transform(object, encoding, callback) {
    this.sum += object.profit;

    callback();
  }

  _flush(callback) {
    this.push(this.sum);
    callback();
  }
}
