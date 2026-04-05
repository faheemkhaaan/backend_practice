const http = require("node:http");
const fs = require("node:fs");

const server = http.createServer();

const hostname = '192.168.24.105'
const port = 4080;
server.on("request", (request, response) => {
    const result = fs.readFileSync("./text.txt");
    response.setHeader("Content-Type", "text/plain");
    response.end(result);
});

server.listen(4080, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
    console.log("Server has started on:", server.address());
});
