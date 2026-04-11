const cpeak = require("cpeak");


const PORT = 5090;
const server = new cpeak();

server.route('get', "/", (req, res) => {
    process.send({ action: "request" });
    res.json({ message: "this is a message" });
});

server.route("get", "/heavy", (req, res) => {
    process.send({ action: "request" });
    for (let i = 0; i < 10_000_000_000; i++) {

    }
    res.json({ message: "The operation is now done." })
})


server.listen(PORT, () => {
    console.log(`Server has stated on port ${PORT}`)
});