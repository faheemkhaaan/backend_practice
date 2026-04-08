
const { spawn, exec } = require("node:child_process");
const { stdout, stdin, stderr } = require('node:process');



/**          Enviroment Variables */
// console.log(process.env.HOME);

stdin.on("data", (data) => {
    console.log('Got this data from standard in: ', data.toString('utf8'))
})

stdout.write("This is some text that i want to write\n");
stderr.write("This is some text that i may not want.")

/** Spawning a process */
const subprocess = spawn('ls');
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