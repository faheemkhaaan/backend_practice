const { Worker } = require("worker_threads");
const { Buffer } = require("buffer");


process.title = "Notify-Wait"

const flag = new Int32Array(new SharedArrayBuffer(4));

const THREADS = 4;

for (let i = 0; i < THREADS; i++) {
    const worker = new Worker('./calc.js', {
        workerData: {
            flag: flag.buffer
        }
    });

};

setTimeout(() => {
    Atomics.notify(flag, 0, 4)
}, 4000);
