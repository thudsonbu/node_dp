# Factory Pattern

The factory pattern wraps the creation of an object allowing greater customization and information hiding during instantiation.

### Guarantees & Uses

- Private data can be encapsulated (`privateProperty` cannot be accessed outside of factory) in a *closure*
- Decouple creation of object from particular implementation ⇒ class determined at run time
- Reduce surface area by not allowing class like extension (classes are encapsulated)
