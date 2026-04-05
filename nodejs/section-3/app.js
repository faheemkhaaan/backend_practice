const {Buffer} = require("buffer");

const memoryContainer = Buffer.alloc(4); // 4 bytes (32 bits)

memoryContainer[0]


memoryContainer[0] = 0xF4;
memoryContainer[1] = 0x34;
memoryContainer[2] = 0x00;
memoryContainer[3] = 0xFF;

console.log(memoryContainer);
console.log(memoryContainer[0]);
console.log(memoryContainer[1]);
console.log(memoryContainer[2]);
console.log(memoryContainer[3]);


console.log(memoryContainer.toString('ascii'))