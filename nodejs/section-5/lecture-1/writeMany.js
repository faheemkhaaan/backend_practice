const fsPromise = require("fs/promises");
const fs = require("fs");

// async function write(path, ){
//     console.time();
//     for(let i = 0; i < 1000000; i++){
//         try {
//             await fs.appendFile(path, `${i}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     console.timeEnd();
// }
// write("./big-file.txt");

// Don't do it this way it takes a lot of memory.
// (async ()=>{
//     console.time("writeMany")
//     const fileHandler = await fsPromise.open("big-file.txt","w");
//     const stream = fileHandler.createWriteStream();
//     for(let i = 0; i < 1000000; i++){
//         const buff = Buffer.from(` ${i} `, 'utf-8')
//         stream.write(buff);
//     }
//      fileHandler.close();
//     console.timeEnd("writeMany");
// })()


// (async ()=>{
//     console.time("writeMany")
//     fs.open("big-file.txt","w",(err,fd)=>{
//         for(let i = 0; i < 1_000_000; i++){
//             fs.writeSync(fd,` ${i} `);
//         }

//         console.timeEnd("writeMany");
//     });

// })()



(async () => {
    console.time("writeMany")
    const fileHandler = await fsPromise.open("big-file.txt", "w");
    const stream = fileHandler.createWriteStream();

    // 8 bits = 1 byte
    // 1000 bytes = 1 kilobyte
    // 1000 kilobytes = 1 megabyte
    // 1000
    // console.log(stream.writableHighWaterMark);
    // const buff = Buffer.alloc(65536,"a");
    // const result =  stream.write(buff);

    // stream.on("drain",()=>{
    //     console.log("We are now save to write more!");
    // })
    let i = 0;
    const million = 1_000_000;
    const writeMany = () => {
        while (i < million) {
            const buff = Buffer.from(` ${i} `, 'utf-8');

            if (i === million - 1) {
                stream.end();
                return;
            }
            if (!stream.write(buff)) break;;
            i++;
        }
    }
    writeMany();

    stream.on("drain", () => {
        writeMany();
    });
    stream.on("finish", async () => {
        await fileHandler.close();
        console.timeEnd("writeMany");
    })

})()


