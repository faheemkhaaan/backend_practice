const { Worker } = require("worker_threads");
const { Buffer } = require("buffer");

process.title = 'deadlock'
const number = Buffer.from(new SharedArrayBuffer(4));
const A = new SharedArrayBuffer(4);
const B = new SharedArrayBuffer(4);
const THREADS = 1;




for (let i = 0; i < THREADS; i++) {
    const worker1 = new Worker('./calc1.js', {
        workerData: { number: number.buffer, A, B }
    });
    const worker2 = new Worker('./calc2.js', {
        workerData: { number: number.buffer, A, B }
    });


};

