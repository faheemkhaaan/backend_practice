const net = require("net");
const readline = require('readline/promises');



let id;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        });
    })
}
const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    });
}

const client = net.createConnection({ port: 3008, host: "127.0.0.1" }, async () => {
    console.log("Connected to the server");

    ask();
});

const ask = async () => {
    const message = await rl.question("Enter a message > ");

    // move curosr one line up.
    await moveCursor(0, -1);
    // clear the current line that the curosr is in.
    await clearLine(0);
    client.write(`${id}-message-${message}`);
}
client.on('data', async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0)
    if (data.toString('utf-8').substring(0, 2) === "id") {
        // when we are getting the id
        // everything from the third character up until the end
        id = data.toString('utf-8').substring(3);
        console.log(`Your id is ${id}!\n`);
    } else {
        // when we are getting a message
        console.log(data.toString('utf-8'));
    }
    ask();
})
client.on('close', () => {
    console.log("closed");
})

client.on("end", () => {
    console.log("Ended");
});

