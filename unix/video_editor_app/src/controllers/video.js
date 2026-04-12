
const path = require('path')
const crypto = require("crypto");
const fs = require('node:fs/promises')
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/utils");
const DB = require('../DB');
const FF = require("../../lib/FF")

const getVideos = (req, res, handleErr) => {
    const name = req.params.get("name");

    if (name) {
        res.json({ message: `Your name is ${name}` });
    } else {
        return handleErr({ status: 400, message: "Please specify a name query param " })
    }
}


const uploadVideos = async (req, res, handleErr) => {
    const specifiedFileName = req.headers.filename;
    const extension = path.extname(specifiedFileName).substring(1).toLowerCase();
    const name = path.parse(specifiedFileName).name;
    const vidoeId = crypto.randomBytes(4).toString('hex');

    const FORMATS_SUPPORTED = ["mov", "mp4"];

    if (FORMATS_SUPPORTED.indexOf(extension) == -1) {
        return handleErr({
            status: 400,
            message: "Only these formats are allowed: mov, mp4"
        })
    }

    try {
        await fs.mkdir(`./storage/${vidoeId}`);
        const fulPath = `./storage/${vidoeId}/original.${extension}`; // Original Video path.
        const file = await fs.open(fulPath, 'w');

        const fileStream = file.createWriteStream();
        const thumbnailPath = `./storage/${vidoeId}/thumbnail.jpg`;
        await pipeline(req, fileStream);

        // Make a thumbnail for the video file


        await FF.makeThumbnail(fulPath, thumbnailPath);

        // Get the dimensions of the video

        const dimensions = await FF.getDimensions(fulPath);

        DB.update();
        DB.videos.unshift({
            id: DB.videos.length,
            vidoeId,
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
        util.deleteFolder(`./storage/${vidoeId}`);
        if (error.code !== "ECONNRESET") return handleErr(error);
        // else return handleErr()

    }



}

const controller = {
    getVideos,
    uploadVideos
};
module.exports = controller;