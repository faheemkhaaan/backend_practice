
const { workerData, threadId } = require('worker_threads');

const number = new Uint32Array(workerData.number);

for (let i = 0; i < 5_000_000; i++) {

    // This is our critical section;
    // read
    // write

    Atomics.add(number, 0, 1);


}
