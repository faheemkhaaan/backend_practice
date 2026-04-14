
const DB = require('../src/DB')
const FF = require("./FF");
const util = require('./utils');

class JobQueue {
    constructor() {
        this.jobs = [];
        this.currentJob = null;

        DB.update();
        DB.videos.forEach(video => {
            Object.entries(video.resizes).map(([key, value]) => {
                if (value.processing) {
                    this.enqueue({
                        videoId: video.videoId,
                        type: "resize",
                        width: Number(key.split("x")[0]),
                        height: Number(key.split("x")[1])
                    })
                }
            })
        });
        console.log(this.jobs);
    }


    enqueue(job) {
        this.jobs.push(job);
        this.executeNext();

    }

    dequeue() {
        return this.jobs.shift();
    }
    executeNext() {
        // dequeue 
        if (this.currentJob) return;

        this.currentJob = this.dequeue();
        if (!this.currentJob) return;
        this.execute(this.currentJob);
    }
    async execute(job) {
        if (job.type === "resize") {
            console.log("Started resizing")
            DB.update();
            const video = DB.videos.find(video => video.videoId === job.videoId);

            const originalVideoPath = `./storage/${video.videoId}/original.${video.extension}`;
            const targetVideoPath = `./storage/${video.videoId}/${job.width}x${job.height}.${video.extension}`;
            try {
                await FF.resize(
                    originalVideoPath,
                    targetVideoPath,
                    job.width,
                    job.height
                );

                DB.update();
                const video = DB.videos.find(video => video.videoId === job.videoId);
                video.resizes[`${job.width}x${job.height}`].processing = false;

                DB.save();
                console.log("Done resizing! Number of Jobs remaining: ", this.jobs.length);
            } catch (error) {

                util.deleteFile(targetVideoPath);
            }
        }

        this.currentJob = null;
        this.executeNext();
    }
}

module.exports = JobQueue