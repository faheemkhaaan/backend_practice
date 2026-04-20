
const { workerData, threadId } = require('worker_threads');

const number = new Uint32Array(workerData.number);
const A = new Int32Array(workerData.A);
const B = new Int32Array(workerData.B);


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

lock(A);

// Doing some thing;
console.log(`${threadId} doing some work after locking A`)

unlock(A);
console.log(`${threadId} unlocking A`)



lock(B);


// Do more work
console.log(`${threadId} doing work with  B`);


unlock(B);

console.log(`${threadId} unlocking B`)
// for (let i = 0; i < 5_000_000; i++) {

//     // This is our critical section;
//     try {
//         lock(seal)

//         number[0] = number[0] + 1;


//         if (number[0] === 1000) {
//             throw "err";
//         }



//     } catch (error) {
//         console.log(error)
//     } finally {

//         unlock(seal);
//     }
// }