/**
 * Because js does not use a class system and is based on objects, the class
 * syntax is syntactic sugar for a constructor function. Underneath the
 * following takes place.
 */

// First at the top of the "heirarchy" we have employee, a function that returns
// an object
function Employee() {
  this.name = "stephen";
  this.dept = "general";
}

// Then we have function to create a manager object that calls this() from the
// employee class which takes the properties from employee and adds them to
// the current this context which is the Manager obj being constructed
function Manager() {
  Employee.call( this );
  this.reports = [];
}

// Specify that prototype for manager is the employee prototype
Manager.prototype = Object.create( Employee.prototype );
// Add the manager function as the constructor for prototypes
Manager.prototype.constructor = Manager;

/**
 * When JavaScript sees the new operator, it creates a new generic object and
 * implicitly sets the value of the internal property [[Prototype]] to the value
 * of Manager.prototype and passes this new object as the value of the this
 * keyword to the WorkerBee constructor function.
 */
let stephen = new Manager();