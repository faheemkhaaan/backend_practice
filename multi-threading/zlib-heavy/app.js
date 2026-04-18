const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

const THREADS = 1;
let completed = 0;
const count = 100_000;
process.env.UV_THREADPOOL_SIZE = 2;

console.log("Thread pool count", process.env.UV_THREADPOOL_SIZE)

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker("./calc-async.js", {
    workerData: { count: count / THREADS },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started.`);

  worker.on("message", (msg) => { });

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${performance.now() - start}ms`);
    }

    if (code !== 0) {
      console.error(new Error(`Worker exited with code ${code}`));
    }
  });
}
