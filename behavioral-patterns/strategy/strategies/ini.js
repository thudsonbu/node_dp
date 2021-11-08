const ini = require('ini');

const iniStrategy = {
  serialize: ( data ) => ini.parse( data ),
  deserialize: ( data ) => ini.stringify( data )
};

module.exports = iniStrategy;
