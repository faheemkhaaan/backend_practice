const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

process.title = "node-rs";

// 1 minute to handle 5 million requests

const THREADS = 1;
const count = 20_000;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker("./calc-batch.js", {
    workerData: {
      count: count / THREADS,
      hostname: "localhost",
      port: 3000,
      path: "/api/v1/tasks",
      method: "POST",
      body: {
        "userId": "3fcd04b7-b2de-4d5a-921d-2a2f848defd5",
        "title": "string",
        "description": "string",
        "status": "available",
        "category": "string",
        "userIntegrationId": "string",
        "contactId": "string",
        "sourceType": "string",
        "priorityScore": 0,
        "priorityBand": "low",
        "aiConfidence": 0,
        "urgencyKeywordsDetected": true,
        "isManual": true,
        "deepLinkUrl": "https://www.udemy.com/course/understanding-nodejs-core-concepts/learn/lecture/45393091#overview",
        "notes": "string",
        "snoozedUntil": "2026-04-19T06:15:36.497Z",
        "dueDate": "2026-04-19T06:15:36.497Z"
      }
    },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started`);

  worker.on("message", (msg) => { });

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${(performance.now() - start) / 1000}s`);
    }

    if (code !== 0) {
      console.error(`Worker exited with code ${code}`);
    }
  });
}
