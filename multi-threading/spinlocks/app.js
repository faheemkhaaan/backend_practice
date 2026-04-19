const { Worker } = require("worker_threads");
const { Buffer } = require("buffer");

process.title = 'spinlock'
const number = Buffer.from(new SharedArrayBuffer(4));
const seal = new SharedArrayBuffer(1);
const THREADS = 4;
let completed = 0;


for (let i = 0; i < THREADS; i++) {
    const worker = new Worker('./calc.js', {
        workerData: { number: number.buffer, seal }
    });

    worker.on("exit", () => {
        completed++;
        if (completed === THREADS) {
            console.log("Final number is: ", number.readUInt32LE().toLocaleString());
        }
    })
};

console.log('Final result should be: ', (THREADS * 5_000_000).toLocaleString())