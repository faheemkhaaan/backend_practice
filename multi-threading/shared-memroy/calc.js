
const { workerData, threadId } = require('worker_threads');

const data = new Uint8Array(workerData.data);
const data2 = Buffer.from(workerData.data2);


console.log(`Thread ${threadId} data:`, data);

data[threadId] = 255;
data2[threadId] = 120;