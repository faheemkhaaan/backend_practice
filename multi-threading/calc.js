const { workerData } = require("worker_threads");

const port = workerData.port;


port.on("message", (msg) => {

    console.log("Worker received", msg)
});


