
const jsonStrategy = {
  deserialize: ( data ) => JSON.parse( data ),
  serialize:   ( data ) => JSON.stringify( data )
};

module.exports = jsonStrategy;
