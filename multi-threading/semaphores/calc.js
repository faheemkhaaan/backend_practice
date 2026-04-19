
const { workerData, threadId } = require('worker_threads');

const number = new Uint32Array(workerData.number);
const seal = new Int32Array(workerData.seal);


function lock(seal) {
    // If seal is 0, stores 1 to it. Always return old value.
    while (Atomics.compareExchange(seal, 0, 0, 1) === 1) {
        Atomics.wait(seal, 0, 1);
    }

}
function unlock(seal) {
    Atomics.store(seal, 0, 0); // unseal (set the seal back to 0)
    Atomics.notify(seal, 0, 1);
}


for (let i = 0; i < 5_000_000; i++) {

    // This is our critical section;
    lock(seal)

    number[0] = number[0] + 1;




    unlock(seal);
}