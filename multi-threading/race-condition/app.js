const { Worker } = require("worker_threads");
const { Buffer } = require("buffer");


const number = Buffer.from(new SharedArrayBuffer(4));

const THREADS = 20;
let completed = 0;


for (let i = 0; i < THREADS; i++) {
    const worker = new Worker('./calc.js', {
        workerData: { number: number.buffer }
    });

    worker.on("exit", () => {
        completed++;
        if (completed === THREADS) {
            console.log("Final number is: ", number.readUInt32LE());
        }
    })
};

console.log('Final result should be: ', THREADS * 500_000)