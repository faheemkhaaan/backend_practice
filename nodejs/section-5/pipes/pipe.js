const fs = require('fs/promises');
const { pipeline } = require('stream');


(async () => {

    console.time('pipe');
    const sourse = await fs.open('src.txt', 'r');
    const dest = await fs.open('text-copy.txt', 'w');

    const read = sourse.createReadStream();
    const write = dest.createWriteStream();

    // read.pipe(write);

    // read.on('end', () => {
    //     console.timeEnd('pipe');
    // })
    pipeline(
        read,
        write,
        (err) => {
            if (err) {
                console.log(err);
            }
            console.timeEnd('pipe');
        }
    )

})()