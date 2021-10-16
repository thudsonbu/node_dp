### Summary

The proxy pattern is used to wrap another object and control it or augment its behavior. It can reference an existing instance and augment its methods, create an entirely new instance with augmented methods, or replace the behavior of the existing instance (highly dangerous).

### Guarantees and Uses

- Data validation (shown in example)
- Security - can be used to validate permissions
- Caching - memoize expensive operation in proxy
- Lazy Initialization - don't initialize underlying object till necessary
- Logging - the proxy intercepts the method invocations and the relative parameters
- Remote Objects - the proxy can take a remote object and make it appear local
