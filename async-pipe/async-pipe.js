// setup
const a = async (x) => {
  console.log("running a");
  return x + "a";
};
const b = async (x) => {
  console.log("running b");
  return x + "b";
};
const c = async (x) => {
  console.log("running c");
  return x + "c";
};

/**
 * This function allows for the creation of an asynchronous functional pipeline
 * in js.
 */

const pipe = (...fns) =>
  fns.reduce((prev, next) => {
    return async (...args) => next(await prev(...args));
  });

async function pipet() {
  // stream is an async function with the promises "stacked"
  let stream = pipe(a, b, c);
  let out = await stream();

  console.log(out);
}

/**
 * You can also replace reduce with reduceRight which makes more sense based on
 * the fact that the function to the right is taking the output. However, this
 * is harder to read.
 */

const rightPipe = (...fns) => (x) =>
  fns.reduceRight((prev, next) => prev.then(next), Promise.resolve(x));

async function pipetRight() {
  let stream = rightPipe(a, b, c);
  let out = await stream();

  console.log(out);
}

async function go() {
  await pipet();
  await pipetRight();
}

go();
