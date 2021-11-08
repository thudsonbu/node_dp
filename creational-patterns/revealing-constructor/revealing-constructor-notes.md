# Revealing Constructor

### Summary

The revealing constructor pattern solves the problem of creating objects that can only be modified and their behavior specified when they are created (usually for security reasons). The revealing constructor pattern has three elements. The *constructor* which takes in a function. The function that the constructor takes in called the *executor*. And the parameters that will be passed in by the *constructor* the *revealedMembers*.

### With Revealing Constructor

The constructor will call the executor when the object is created and will allow it to modify the object being created. Because the revealed members are only passed into the function when the object is created and exist only in the constructor, they can only be used at this time which maintains their security. The modifiers act as a *proxy* between the buffer object being created and the executor.

### Guarantees & Uses

- Objects modified only at creation time and is *Immutable*
- Objects that can only be initialized at creation time
- Secure internals (buffer is not available)
- Proxy used in construction
