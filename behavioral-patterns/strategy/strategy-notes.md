# Strategy Pattern

## Summary

The strategy pattern enable an object, called the **context** to support variations in its logic by extracting the variable parts into separate interchangeable objects called **strategies**.

**Strategies** are a family of solutions and implement the *same interface* expected by the context.

This stategy is most commonly seen in auth strategies.

## Example

This example includes the `Config` class which is used to parse and wrap around config objects and a strategy for the `Config` class `./strategies/json.js` . The `Config` class uses the `json` strategy to manipulate a file called `config.json`

### config.js

```jsx
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
```

### json.js

```jsx
const jsonStrategy = {
  deserialize: ( data ) => JSON.parse( data ),
  serialize:   ( data ) => JSON.stringify( data )
};

module.exports = jsonStrategy;
```

### config.json

```jsx
{
  "name": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "age": 21
}
```

### index.js

```jsx
const Config       = require('./config');
const jsonStrategy = require('./strategies/json');

const config = new Config( jsonStrategy );

config.load('config.json');

const name = config.get('name');

console.log( name );

config.set('hair', 'blond');

const hair = config.get('hair');

console.log( hair );
```

### Guarantees & Uses

- Seperation of concerns base on each **Strategy**
- Customization of behavior based on **Context**
