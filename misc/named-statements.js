/**
 * You can name a statement in js such a while loop or if statement. This allows
 * you to control its operation with break or continue inside a nested scope.
 */

function example() {
  let iterations = 0;

  const arr = [1, 2, 3, 4];

  outer: while (iterations < 2) {
    iterations += 1;

    for (const num of arr) {
      if (num == 3) {
        console.log("Ope we hit three " + num);
        continue outer;
      }
      console.log(" And its not yet 3");
    }
  }
}

example();