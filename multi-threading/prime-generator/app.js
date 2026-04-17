
const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks")

// count: 200, start: 100_000_000_000_000, time: 2s threads: 4
// count: 200, start: 100_000_000_000_000, time: 5s  threads: 1

//______Big Int_____________
// count: 20, start: 100_000_000_000_000n, time: 0.83s  threads: 1
// count: 80, start: 100_000_000_000_000n, time: 3.4s  threads: 1
// count: 200, start: 100_000_000_000_000n, time: 8.2s  threads: 1
// count: 200, start: 12n ** 17n, time: 622.1s or (10.22m)  threads: 4


let result = []
const THREADS = 4;
let completed = 0;
const count = 200; // number of prime number that we want.
for (let i = 0; i < THREADS; i++) {
    const start = performance.now();
    const worker = new Worker('./calc.js', {
        workerData: { count: count / THREADS, start: 12n ** 17n + BigInt(i * 300) }
    });
    const threadId = worker.threadId;
    console.log(`Worker ${threadId} started.`);
    worker.on("message", (primes) => {
        result = result.concat(primes)
    });

    worker.on("error", (err) => {
        console.error(err);
    });

    worker.on("exit", (code) => {
        console.log(`Worker ${threadId} exited `)
        completed++
        if (completed === THREADS) {
            console.log(`Time Taken: ${performance.now() - start}ms`);
            console.log(result.sort());
        }

        if (code !== 0) {
            console.error(`Worker ${threadId} exited with code ${code}`)
        }
    })
}