

const cluster = require("node:cluster");

console.log('-------------')
if (cluster.isPrimary) {
    let requestCount = 0;


    setInterval(() => {
        console.log(`Total number of request ${requestCount}`);
    }, 5000);
    console.log(`This is the parent. ${process.pid}`)

    const coresCount = require('node:os').availableParallelism();
    for (let i = 0; i < coresCount; i++) {
        const worker = cluster.fork();
        console.log(`The parent process spawned a new process with PID ${worker.process.pid}`)

    };

    cluster.on("message", (data) => {
        cluster.on("message", (worker, message) => {
            if (message.action && message.action === "request") {
                requestCount++;
            }
        })
    });
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} ${signal || code}  died. Restarting...`);
        cluster.fork();
    });
} else {
    console.log("This is the child.")

    require('./server.js');
}