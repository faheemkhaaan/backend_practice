const fs = require('fs/promises');
const { Readable } = require('stream');
const { finished } = require('stream/promises'); // Better for async/await

(async () => {
    const fileSize = 100_000_000;
    const fileHandle = await fs.open('./big-file.txt', 'w');

    // Create the stream from the handle
    const writeStream = fileHandle.createWriteStream();

    async function* generateData() {
        for (let j = 0; j < fileSize; j++) {
            yield `${j} `; // Added a space so numbers don't bunch up
        }
    };

    const readable = Readable.from(generateData());

    console.log('Starting pipe...');

    // Use pipe to connect them
    readable.pipe(writeStream);

    // CRITICAL: We must wait for the stream to actually finish 
    // before closing the file handle or ending the process.
    await finished(writeStream);

    console.log('Finished writing file');

    // Clean up the handle
    await fileHandle.close();
})();