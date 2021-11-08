# Strategy Pattern

## Summary

The strategy pattern enable an object, called the **context** to support variations in its logic by extracting the variable parts into separate interchangeable objects called **strategies**.

**Strategies** are a family of solutions and implement the *same interface* expected by the context.

This stategy is most commonly seen in auth strategies.

## Example

This example includes the `Config` class which is used to parse and wrap around config objects and a strategy for the `Config` class `./strategies/json.js` . The `Config` class uses the `json` strategy to manipulate a file called `config.json`

### Guarantees & Uses

- Seperation of concerns base on each **Strategy**
- Customization of behavior based on **Context**
