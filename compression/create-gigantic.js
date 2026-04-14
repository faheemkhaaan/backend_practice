

const fs = require("node:fs");
const { Readable } = require("node:stream");
const { finished } = require("node:stream/promises")


async function writeGiganticFile() {
    const writeStream = fs.createWriteStream('./text-gigantic.txt');

    async function* generateData() {
        for (let i = 0; i < 100_000_000; i++) {
            yield `${i} `;
        }
    };

    Readable.from(generateData()).pipe(writeStream);
    await finished(writeStream);
    console.log("Done writing!")
}
writeGiganticFile()