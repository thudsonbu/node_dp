const { count } = require("console");
const stream = require("stream");

class FilterByCountry extends stream.Transform {
  constructor(country, options) {
    options.objectMode = true;
    super({ ...options });
    this.country = country;
  }

  _transform(object, encoding, callback) {
    if (object.country === this.country) {
      this.push(object);
    }

    callback();
  }
}
