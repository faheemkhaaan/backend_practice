const { workerData, parentPort } = require("worker_threads");

// const port = workerData.port;


// port.on("message", (msg) => {

//     console.log("Worker received", msg)
// });


// port.postMessage("Hello from tread")


const port = parentPort;


port.on("message", (msg) => {

    console.log("Worker received", msg)
});


port.postMessage("Hello from tread")