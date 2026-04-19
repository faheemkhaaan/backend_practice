const { Worker } = require("worker_threads");
const { Buffer } = require("buffer");


const data = new Uint8Array(new SharedArrayBuffer(8));
const data2 = new Uint8Array(new SharedArrayBuffer(16));

console.log("Original Data:", data);

for (let i = 0; i < 2; i++) {
    new Worker('./calc.js', { workerData: { data: data.buffer, data2: data2.buffer } });
};

setTimeout(() => {
    console.log("Data in main after 1 second: ", data);
    console.log("Data in main after 1 second: ", data2);
}, 1000);