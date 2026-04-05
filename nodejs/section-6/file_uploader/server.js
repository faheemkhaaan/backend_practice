
const net = require('net');
const fs = require('node:fs/promises')
const server = net.createServer(() => { })

let fileHandle, fileStream;
server.on('connection', async (socket) => {
    console.log('Net connection!');

    socket.on('data', async (data) => {
        if (!fileHandle) {
            socket.pause();
            const indexOfDivider = data.indexOf("-------");
            const fileName = data.subarray(10, indexOfDivider).toString('utf-8');
            fileHandle = await fs.open(`storage/${fileName}`, "w");
            fileStream = fileHandle.createWriteStream();
            fileStream.write(data.subarray(indexOfDivider + 7));
            socket.resume();
            fileStream.on('drain', () => {
                socket.resume();
            });
        } else {
            if (!fileStream.write(data)) {
                socket.pause();
            }
        }
    });

    socket.on('end', () => {
        console.log("Connection ended");
        fileHandle = undefined;
        fileStream = undefined;
        // fileHandler.close();
    });
});

server.listen(5050, "::1", () => {
    console.log('Uploader server opended on', server.address());
});