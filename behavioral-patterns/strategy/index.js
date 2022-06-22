
const Config       = require('./classes/config');
const jsonStrategy = require('./strategies/json');

const config = new Config( jsonStrategy );

config.load('config.json');

const name = config.get('name');

console.log( name );

config.set( 'hair', 'blond' );

const hair = config.get('hair');

console.log( hair );
