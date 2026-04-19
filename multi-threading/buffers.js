
const { Buffer } = require('buffer')

// const buff1 = Buffer.alloc(10, 2);
const buff2 = new Int32Array(16);

buff2[1] = -54;

// console.log(buff1.buffer)
// console.log(buff1.byteOffset)
// console.log(Buffer.poolSize)
// console.log(buff2);

const rawBuf = new ArrayBuffer(20);
const viewBuff = Buffer.from(rawBuf);
viewBuff[1] = 34
console.log(rawBuf)
// console.log(viewBuff)