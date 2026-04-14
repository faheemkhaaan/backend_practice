

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
    });
}

const getDimensions = (fullPath) => {
    return new Promise((resolve, reject) => {
        if (!fullPath) {
            reject(new Error(`Fullpath is required! got ${fullPath}`));
        }
        const ffprobe = spawn("ffprobe", ['-v', 'error', '-select_streams', "v:0", '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fullPath]);

        ffprobe.stdout.on('data', (data) => {
            const output = data.toString().trim();
            const [width, height] = output.split(",");
            console.log(`############ WIDTH and HEIGHT ##############`);
            console.log(width, height);
            console.log(`############ WIDTH and HEIGHT ##############`);
            resolve({
                width: Number(width),
                heigth: Number(height)
            })
        });

        ffprobe.stderr.on("data", (data) => {
            reject(data);
        })
    })
}


const extractAudio = (originalVideoPath, targetAudioPath) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg",
            [
                '-i',
                originalVideoPath,
                '-vn',
                '-c:a',
                'copy',
                targetAudioPath
            ]
        );

        ffmpeg.on("error", (err) => {
            reject(err);
        })
        ffmpeg.on("close", (code) => {
            if (code !== 0) {
                reject()
            } else {
                resolve();
            }
        })
    })
}

const resize = (originalVideoPath, targetVideoPath, width, height) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i',
            originalVideoPath,
            '-vf',
            `scale=${width}:${height}`,
            '-c:a',
            'copy',
            '-y',
            targetVideoPath
        ]);

        ffmpeg.stderr.on("data", (data) => {
            console.log(data);
        })

        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject();
            }
        });

        ffmpeg.on('error', (err) => {
            reject(err)
        })

    })
}

module.exports = { makeThumbnail, getDimensions, extractAudio, resize };