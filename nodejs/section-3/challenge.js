const {Buffer} = require("buffer")

const memoryContainer = Buffer.alloc(3);

// 0100 1000 0110 1001 0010 0001

console.log(memoryContainer);

memoryContainer[0] = 0x48;
memoryContainer[1] = 0x69;
memoryContainer[2] = 0x21;

console.log(memoryContainer.toString('utf-8'));
const buff = Buffer.from([0x48,0x69,0x21]);
console.log(buff.toString('utf-8'))