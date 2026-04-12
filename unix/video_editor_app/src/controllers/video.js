
const path = require('path')
const crypto = require("crypto");
const fs = require('node:fs/promises')
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/utils");
const DB = require('../DB');

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

    try {
        await fs.mkdir(`./storage/${vidoeId}`);
        const fulPath = `./storage/${vidoeId}/original.${extension}`; // Original Video path.
        const file = await fs.open(fulPath, 'w');

        const fileStream = file.createWriteStream();

        await pipeline(req, fileStream);

        // Make a thumbnail for the video file
        // Get the dimensions of the video

        DB.update();



        DB.videos.unshift({
            id: DB.videos.length,
            vidoeId,
            name,
            extension,
            userId: req.userId,
            extractedAudio: false,
            resizes: {},

        });
        DB.save();
        res.status(200).json({
            status: "success",
            message: "The file was uploaded successfully!"
        })

    } catch (error) {
        // Delete the whole folder
        util.deleteFolder(`./storage/${vidoeId}`);
        if (error.code !== "ECONNRESET") return handleErr(error);

    }



}

const controller = {
    getVideos,
    uploadVideos
};
module.exports = controller;