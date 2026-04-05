
const http = require("node:http");
const fs = require("fs/promises");
const path = require("node:path");

const server = http.createServer();

server.on("request", async (request, response) => {
    console.log(request.method + " " + request.url)

    if (request.url === '/' && request.method === "GET") {
        response.setHeader('Content-Type', 'text/html');

        const fileHandle = await fs.open('./static/index.html', 'r');
        const fileStream = fileHandle.createReadStream();

        fileStream.pipe(response);

    }

    if (request.url === "/style.css" && request.method === 'GET') {
        response.setHeader("Content-Type", "text/css");
        const fileHandle = await fs.open("./static/style.css", 'r');
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response);
    }

    if (request.url === '/script.js' && request.method === "GET") {
        response.setHeader("Content-Type", "text/javascript");
        const fileHandle = await fs.open("./static/script.js", 'r');
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response);
    }

    if (request.url === "/login" && request.method === "GET") {
        response.setHeader("Content-Type", 'application/json');
        response.statusCode = 200;
        const body = {
            message: "Logging you in"
        }
        response.end(JSON.stringify(body));
    }

    if (request.url === "/upload" && request.method === "POST") {
        response.setHeader("Content-Type", 'application/json')
        const fileHandle = await fs.open('./storage/image.jpeg', "w");

        const fileStream = fileHandle.createWriteStream();
        request.pipe(fileStream);

        request.on("end", () => {
            response.end(JSON.stringify({ message: "File was uploaded succcessfully" }))
        })
    }

});

const app = e();

app.get('/', (req, res) => {
    const { userName } = req.body;
})
function e() {
    const server = http.createServer();

    return {
        get: (path, callback) => {
            server.on("request", async (request, response) => {
                if (request.url === path && request.method === "GET") {
                    callback(request, response)
                }
            })
        },
        listen: (port, fn) => server.listen(port, fn)
    };
}


server.listen(9000, () => {
    console.log("Web server is listening at http://localhost:9000 ")
})