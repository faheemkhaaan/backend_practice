
const path = require('path')
const crypto = require("crypto");
const fs = require('node:fs/promises')
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/utils");
const DB = require('../DB');
const FF = require("../../lib/FF")

const getVideos = (req, res, handleErr) => {
    DB.update()
    const videos = DB.videos.filter((video) => video.userId === req.userId);

    res.status(200).json(videos);

}


const uploadVideos = async (req, res, handleErr) => {
    const specifiedFileName = req.headers.filename;
    const extension = path.extname(specifiedFileName).substring(1).toLowerCase();
    const name = path.parse(specifiedFileName).name;
    const videoId = crypto.randomBytes(4).toString('hex');

    const FORMATS_SUPPORTED = ["mov", "mp4"];

    if (FORMATS_SUPPORTED.indexOf(extension) == -1) {
        return handleErr({
            status: 400,
            message: "Only these formats are allowed: mov, mp4"
        })
    }

    try {
        await fs.mkdir(`./storage/${videoId}`);
        const fulPath = `./storage/${videoId}/original.${extension}`; // Original Video path.
        const file = await fs.open(fulPath, 'w');

        const fileStream = file.createWriteStream();
        const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`;
        await pipeline(req, fileStream);

        // Make a thumbnail for the video file


        await FF.makeThumbnail(fulPath, thumbnailPath);

        // Get the dimensions of the video

        const dimensions = await FF.getDimensions(fulPath);

        DB.update();
        DB.videos.unshift({
            id: DB.videos.length,
            videoId,
            name,
            extension,
            dimensions,
            userId: req.userId,
            extractedAudio: false,
            resizes: {},
        });
        DB.save();
        res.status(201).json({
            status: "success",
            message: "The file was uploaded successfully!"
        })

    } catch (error) {
        // Delete the whole folder
        util.deleteFolder(`./storage/${videoId}`);
        if (error.code !== "ECONNRESET") return handleErr(error);
        // else return handleErr()

    }



}


const getVideoAsset = async (req, res, handleErr) => {
    try {
        const videoId = req.params.get("videoId");
        const type = req.params.get("type"); // thumbnail, original,audio,resize

        DB.update();;
        const video = DB.videos.find(video => video.videoId === videoId);

        if (!video) {
            return handleErr({
                status: 404,
                message: "Video not found"
            })
        };

        let file;
        let mimeType;
        let filename; // the final file name for the download (including the extension)
        switch (type) {
            case "thumbnail":
                file = await fs.open(`./storage/${videoId}/thumbnail.jpg`, "r");
                mimeType = "image/jpeg";
                break;
            case "original":
                file = await fs.open(`./storage/${videoId}/original.${video.extension}`);
                mimeType = `video/mp4`;
                filename = `${video.name}.${video.extension}`;
                break;
            case "audio":
                file = await fs.open(`./storage/${videoId}/audio.acc`, 'r');
                mimeType = "audio/acc";
                filename = `${video.name}-audio.acc`;
                break;

            case "resize":
                const dimensions = req.params.get("dimensions");
                file = await fs.open(`./storage/${videoId}/${dimensions}.${video.extension}`);
                mimeType = `video/mp4`;
                filename`${video.name}-${dimensions}.${video.extension}`;
                break;

        }

        const stat = await file.stat();
        const fileStream = file.createReadStream();



        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Length", stat.size);

        if (mimeType === "video/mp4") {
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
        }

        res.status(200);
        await pipeline(fileStream, res);
        file.close();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


const controller = {
    getVideos,
    uploadVideos,
    getVideoAsset
};
module.exports = controller;