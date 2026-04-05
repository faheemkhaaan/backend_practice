const { Writable } = require('node:stream')
const fs = require('node:fs');


class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fileHandle = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCounts = 0;
    }

    // this will run after the constructor, and it will put of calling all the other methods 
    // until we call the callback function
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                // so if we call the callback with an argument, it means that we have an error,
                // and we should not procceed.
                callback(err);
            } else {
                this.fileHandle = fd;
                // no argument means it was successful
                callback();
            }

        })
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
                ++this.writesCounts;
                callback();
            })
        } else {
            callback();
        }


        console.log(this.fileHandle);
        // do our write operation... 

        // when we are done, we should call the callback function

    }

    _final(callback) {
        fs.write(this.fileHandle, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            callback();
        })
    }

    _destroy(error, callback) {

        console.log('chunkSize', this.chunksSize);
        console.log('wirtes', this.writesCounts);
        if (this.fileHandle) {
            fs.close(this.fileHandle, (err) => {
                callback(err | error);
            })
        } else {
            callback(error);
        }
    }

}

const stream = new FileWriteStream({ highWaterMark: 1800, fileName: 'text.txt' });
stream.write(Buffer.from("This is some string."));
stream.end(Buffer.from("Our last write"))

stream.on('finish', () => {
    console.log('stream was finished');
})