/* The bind function is used to change the this context of a function or add one
if the function is going to be passed somewhere else. */

const person = {
  name: "Tom",

  getName() {
    console.log( this.name );
  }
};

