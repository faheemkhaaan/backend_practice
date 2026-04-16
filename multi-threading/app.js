
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

/*Example 3 Communication between 2 worker threads 

const { port1, port2 } = new MessageChannel();

const thread1 = new Worker("./calc.js", { workerData: { port: port1 }, transferList: [port1] });
const thread2 = new Worker("./calc.js", { workerData: { port: port2 }, transferList: [port2] });

*/

/* Communication bewteen main thread and 2 worker threads */

// const channel1 = new MessageChannel();
// const channel2 = new MessageChannel();

// const thread1 = new Worker("./calc.js", {
//     workerData: { port: channel1.port2 },
//     transferList: [channel1.port2]
// });
// const tread2 = new Worker("./calc.js", {
//     workerData: { port: channel2.port2 },
//     transferList: [channel2.port2]
// });

// channel1.port1.on("message", (msg) => {
//     console.log("Main thread message received from channel 1", msg);
// });

// channel2.port1.on("message", (msg) => {
//     console.log("Main thread message received from channel 2", msg);
// });

// channel1.port1.postMessage("Hello tread 1 from main thread")
// channel2.port1.postMessage("Hello tread 2 from main thread")



const thread = new Worker("./calc.js");

thread.on("message", (msg) => {
    console.log('Main thread got this', msg);
});

thread.postMessage({ namg: "Joe" });