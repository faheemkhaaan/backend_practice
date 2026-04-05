const http = require("node:http");

const server = http.createServer();


server.on('request', (request, response) => {

    console.log("------ METHOD: ------");
    console.log(request.method);

    console.log("------ URL: ------");
    console.log(request.url);

    console.log("------ HEADERS: ------");
    console.log(request.headers);

    const name = request.headers.name;
    let data = ''
    console.log('----- BODY -----')
    request.on('data', (chunk) => {
        data += chunk.toString();
        console.log(chunk.toString('utf-8'))
    });

    request.on('end', () => {
        data = JSON.parse(data);
        console.log(name);
        console.log(data);

        response.writeHead(200, { "content-type": 'application/json' });
        response.end(JSON.stringify({ message: `Post with title ${data.title} was created by ${name}` }))
    })
})


server.listen(8050, () => {
    console.log("Server listening on http://localhost:8050");
})