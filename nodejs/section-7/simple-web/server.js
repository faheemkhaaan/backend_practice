

const Butter = require("../butter");

const PORT = 8000
const server = new Butter();


server.route('get', '/', (req, res) => {
    res.status(200).sendFile('./static/index.html', 'text/html')
})


server.listen(PORT, () => {
    console.log(`Server has started on port http://localhost:${PORT}`)
})