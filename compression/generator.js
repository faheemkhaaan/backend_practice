const { Readable } = require("node:stream");






async function* generateData() {
    for (let i = 0; i < 100_000_000; i++) {
        yield `${i} `;
    }
};


const readableStream = Readable.from(generateData());

readableStream.on("readable", () => {
    let chunk;
    while ((chunk = readableStream.read()) !== null) {
        console.log(chunk);
    }
})