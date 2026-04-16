
const { Worker } = require("worker_threads");

const a = 400;

const thread1 = new Worker('./calc.js');
const thread2 = new Worker('./calc.js');

setTimeout(() => {
    const thread3 = new Worker("./calc.js")
    console.log("Hello world")
}, 5000);

console.log(a)