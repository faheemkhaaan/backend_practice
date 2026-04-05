const net = require('net');

// createServer and createConnection are the most important ones
const server = net.createServer();

const clients = [];
server.on('connection', async (socket) => {
    console.log("A new connection to the server");

    const clientId = clients.length + 1;
    const handleClientLeave = () => {
        // broadcasting a message to everyone when someone leaves chat room.
        socket.on('end', () => {
            clients.map(client => {
                client.socket.write(`User ${clientId} left!`);
            })
        });
        socket.on("error", () => {
            clients.map(client => {
                client.socket.write(`User ${clientId} left!`);
            })
        });
    }

    // boradcasting message to all the clients when someone enters the room.
    clients.forEach(client => {
        client.socket.write(`User ${clientId} joined!`)
    })
    socket.write(`id-${clientId}`);
    socket.on('data', (data) => {
        const dataString = data.toString('utf-8')
        const id = dataString.substring(0, dataString.indexOf('-'));
        const message = dataString.substring(dataString.indexOf('-message-') + 9);
        clients.forEach(client => {
            client.socket.write(`> User ${id}: ${message}`)
        });
    });

    // broadcasting a message to everyone when someone leaves chat room.
    handleClientLeave()
    clients.push({ id: clientId.toString(), socket });

});

server.listen(3008, "127.0.0.1", () => {
    console.log('opend server on ', server.address());
});