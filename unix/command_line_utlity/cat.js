
const { stdin, stdout, stderr, argv, exit } = require('process');
const fs = require('fs');

const filePath = argv[2];


if (filePath) {
    const fileReadStream = fs.createReadStream(filePath);
    fileReadStream.pipe(stdout);
    fileReadStream.on('end', () => {
        exit(0);
    })
}
stdin.on('data', (data) => {
    // console.log(data.toString("utf8"));
    stdout.write(data.toString('utf8').toUpperCase());
});


