const { Duplex } = require('node:stream');
const fs = require('fs');


class DuplexStream extends Duplex {
    constructor({
        writableHighWaterMark,
        readableHighWaterMark,
        writeFileName,
        readFileName,
    }) {

        super({ readableHighWaterMark, writableHighWaterMark });
        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }
    _construct(callback) {
        fs.open(this.readFileName, 'r', (err, fd) => {
            if (err) return callback(err);
            this.readFd = fd;
            fs.open(this.writeFileName, 'w', (err, fd) => {
                if (err) return callback(err);
                this.writeFd = fd;
                callback();
            })
        });
    }
    _write(chunk, encoding, callback) {

        this.chunks.push(chunk);
        this.chunksSize += chunk.length;
        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fileHandle, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                callback();
            })
        } else {
            callback();
        }
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err);
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        })

    }

    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            callback();
        })
    }

    _destroy(error, callback) {
        if (this.writeFd) {
            fs.close(this.writeFd, (err) => {
                if (err) callback(err || error);
            })
        } else {
            callback(error);
        }
    }
}


const duplex = new DuplexStream({
    readFileName: "read.txt",
    writeFileName: "write.txt"
});

// duplex.write(Buffer.from('this is a string 1'))
// duplex.write(Buffer.from('this is a string 2'))
// duplex.write(Buffer.from('this is a string 3'))
// duplex.write(Buffer.from('this is a string 4'));
// duplex.end(Buffer.from('end of write'));


duplex.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'))
})