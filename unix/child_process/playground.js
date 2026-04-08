
const { spawn, exec } = require("node:child_process");
const { stdout, stdin, stderr } = require('node:process');



/**          Enviroment Variables */
// console.log(process.env.HOME);

stdin.on("data", (data) => {
    console.log('Got this data from standard in: ', data.toString('utf8'))
})

// stdout.write("This is some text that i want to write\n");
// stdout.write("Learned about how to redirect the stardard ouput or standard error to a file\n");
stdout.write("Appending to text.txt.\n");
stderr.write("Learned about output redirection. And chaining processes.")
stdout.write("Hello from the terminal");
// /** Spawning a process */
// const subprocess = spawn('ls');
// subprocess.stdout.on("data", (data) => {
//     console.log(data.toString('utf-8'))
// });
// console.log("This is edited from the terminal");
// exec('echo "something string" | tr " " "\n" ', (error, stdout, stderr) => {
//     if (error) {
//         console.log(error);
//         return;
//     };
//     console.log(stdout);
//     console.log(`stderr: ${stderr}`)
// }); 
