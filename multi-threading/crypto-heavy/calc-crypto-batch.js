const { workerData, parentPort } = require("worker_threads");
const crypto = require("crypto");

const BTACH_SIZE = 4096; // number of bytes to generate in each batch
const buffer = Buffer.alloc(BTACH_SIZE);


function fillBuffer() {
  crypto.randomFillSync(buffer)
}

// function generateRandomNumber() {
//   crypto.randomFillSync(buffer);
//   const randomValue = buffer.readUInt16BE(0); // read the buffer as an unsigned 16-bit integer
//   return randomValue;
// }


function readRandomNumber(offset) {
  const randomNumber = buffer.readUint16BE(offset);
  return randomNumber;
}

let sum = 0;
let random;
let bufferOffset = 0;
fillBuffer();

for (let i = 0; i < workerData.count; i++) {
  if (bufferOffset >= BTACH_SIZE) {
    fillBuffer();
    bufferOffset = 0;
  }
  random = readRandomNumber(bufferOffset);
  bufferOffset += 2; // move to the nest 16 bit segment
  sum += random;

  if (sum > 100_000_000) {
    sum = 0;
  }
}

parentPort.postMessage(sum);
