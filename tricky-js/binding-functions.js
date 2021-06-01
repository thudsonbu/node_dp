/* The bind function is used to change the this context of a function or add one
if the function is going to be passed somewhere else. */

const person = {
  name: "Tom",

  getName() {
    return this.name;
  }
};

function printName( printFunc ) {
  console.log( printFunc() );
}

printName( person.getName ); // undefined

/* This returns undefined because the this context of the getName() function is
undefined. In order to add the this context of person to the function we can use
.bind() which is a method of the function prototype */

let newFunc = person.getName.bind( person );

printName( newFunc );



