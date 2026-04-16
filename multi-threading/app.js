
const { Worker, MessageChannel } = require("worker_threads");

/*
// const thread1 = new Worker('./calc.js');
const obj = {name:"Joe"};
new Worker("./calc.js", { workerData: obj });
*/

/*

Example 2 - Message Channels
const channel = new MessageChannel();

const { port1, port2 } = channel;


port1.postMessage({ name: "Joe" });
port1.postMessage({ name: "Rodent" });

port1.on("message", (msg) => {
    console.log(`Message received on port1`, msg)
})

port2.on("message", (msg) => {
    console.log(`Message received on port2`, msg);
});

*/

/* Communication between 2 worker threads */