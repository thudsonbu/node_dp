const objectPath = require("object-path");
const fs         = require("fs");

class Config {
  constructor( formatStrategy ) {
    this.data = {};
    this.formatStrategy = formatStrategy;
  }

  get( configPath ) {
    return objectPath.get( this.data, configPath );
  }

  set( configPath, value ) {
    return objectPath.set( this.data, configPath, value );
  }

  async load( filePath ) {
    console.log(`Deserializing from ${filePath}`);

    this.data = this.formatStrategy.deserialize(
      fs.readFileSync( filePath, 'utf8' )
    );
  }

  async save( filePath ) {
    console.log(`Serializing from ${filePath}`);

    fs.writeFileSync(
      filePath,
      this.formatStrategy.serialize( this.data )
    );
  }
}

module.exports = Config;
