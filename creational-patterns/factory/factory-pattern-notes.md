# Factory Pattern

The factory pattern wraps the creation of an object allowing greater customization during instantiation.

### Without Factory Pattern

```jsx
function createAutomobile( name ) {
	return new Automobile( name );
}
```

### With Factory Pattern

```jsx
function createAutomobile( name ) {
	const privateProperty = { horsepower: 600 };

	if ( name === 'Lamborghini' ) {
		return new Lamborghini( name, privateProperty.horsepower );
	} else {
		return new Car( name );
	}
}
```

### Guarantees & Uses

- Private data can be encapsulated (`privateProperty` cannot be accessed outside of factory) in a *closure*
- Decouple creation of object from particular implementation ⇒ class determined at run time
- Reduce surface area by not allowing class like extension (classes are encapsulated)
