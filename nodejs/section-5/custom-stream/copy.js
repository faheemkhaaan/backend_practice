
const fs = require('fs/promises');

// (async () => {
//     const destFile = await fs.open('text-copy.txt', 'w');
//     const result = await fs.readFile("src.txt");

//     console.log(result);

//     await destFile.write(result);

// })()



// (async () => {

//     console.time("copy");
//     const srcFile = await fs.open('src.txt', 'r');
//     const destFile = await fs.open("text-copy.txt", 'w');



//     let bytesRead = -1;
//     while (bytesRead !== 0) {
//         const readResult = await srcFile.read();
//         bytesRead = readResult.bytesRead;

//         console.log(readResult.buffer);
//         if (bytesRead !== 16384) {
//             const indexOfNotFilled = readResult.buffer.indexOf(0);
//             const newBuffer = Buffer.alloc(indexOfNotFilled);
//             readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//             destFile.write(newBuffer);

//         } else {
//             destFile.write(readResult.buffer);
//         }

//     }
//     console.log(await srcFile.read());

//     console.timeEnd("copy");

// })()


(async () => {

    console.time("copy");

    const srcFile = await fs.open('src.txt', 'r');
    const destFile = await fs.open("text-copy.txt", 'w');

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    readStream.pipe(writeStream);

    readStream.on('end', () => {
        console.timeEnd("copy");

    })


})()