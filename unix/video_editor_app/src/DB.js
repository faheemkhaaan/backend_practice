const fs = require("node:fs");

const usersPath = "./data/users";
const sessionsPath = "./data/sessions";
const videoPath = "./data/videos"

class DB {
  constructor() {



    /**
     * @type {Array}
     */
    this.videos = JSON.parse(fs.readFileSync(videoPath));

    /*
     A sample object in this users array would look like:
     { id: 1, name: "Liam Brown", username: "liam23", password: "string" }
    */
    this.users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    /*
     A sample object in this sessions array would look like:
     { userId: 1, token: 23423423 }
    */
    this.sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf8"));
  }

  update() {
    this.videos = JSON.parse(fs.readFileSync(videoPath));
    this.users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
    this.sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf8"));
  }

  save() {
    fs.writeFileSync(videoPath, JSON.stringify(this.videos))
    fs.writeFileSync(usersPath, JSON.stringify(this.users));
    fs.writeFileSync(sessionsPath, JSON.stringify(this.sessions));
  }
}

const db = new DB();

module.exports = db;
