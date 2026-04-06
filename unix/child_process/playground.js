
const { spawn, exec } = require("node:child_process");



const subprocess = spawn('ls');


console.log(process.env.MODE);

// subprocess.stdout.on("data", (data) => {
//     console.log(data.toString('utf-8'))
// });

// exec('echo "something string" | tr " " "\n" ', (error, stdout, stderr) => {
//     if (error) {
//         console.log(error);
//         return;
//     };
//     console.log(stdout);
//     console.log(`stderr: ${stderr}`)
// }); 