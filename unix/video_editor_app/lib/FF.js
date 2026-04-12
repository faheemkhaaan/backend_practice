

const { spawn } = require('node:child_process');



const makeThumbnail = (fullPath, thumbnailPath) => {
    return new Promise((resolve, reject) => {

        const ffmpeg = spawn("ffmpeg", ['-i', fullPath, '-ss', '5', '-vframes', '1', thumbnailPath]);

        ffmpeg.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });
        ffmpeg.stderr.on("data", (data) => {
            console.log(`stderr: ${data}`);
        });
        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve("Thumbnail created successfully");
            } else {
                reject(new Error(`FFmpeg process exited with code ${code}`));
            }
        });

        ffmpeg.on("error", err => {
            reject(err);
        })
    })
}

const getDimensions = (fullPath) => {
    return new Promise((resolve, reject) => {
        if (!fullPath) {
            reject(new Error(`Fullpath is required! got ${fullPath}`));
        }
        const ffprobe = spawn("ffprobe", ['-v', 'error', '-select_streams', "v:0", '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fullPath]);

        ffprobe.stdout.on('data', (data) => {
            const output = data.toString().trim();
            const [width, heigth] = output.split(",");
            console.log(`############ WIDTH and HEIGHT ##############`);
            console.log(width, heigth);
            console.log(`############ WIDTH and HEIGHT ##############`);
            resolve({
                width: Number(width),
                heigth: Number(heigth)
            })
        });

        ffprobe.stderr.on("data", (data) => {
            reject(data);
        })
    })
}

module.exports = { makeThumbnail, getDimensions };