
const { workerData, threadId } = require('worker_threads');

const number = new Uint32Array(workerData.number);
const seal = new Uint8Array(workerData.seal);



for (let i = 0; i < 5_000_000; i++) {

    // This is our critical section;

    while (Atomics.compareExchange(seal, 0, 0, 1) === 1) { }

    number[0] = number[0] + 1;


    Atomics.store(seal, 0, 0);


}
