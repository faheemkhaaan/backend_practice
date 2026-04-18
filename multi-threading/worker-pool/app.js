
const Pool = require("./pool");
const { performance } = require("perf_hooks");
const numberWorker = 4;
const pool = new Pool(numberWorker);


let result = []
let tasksDone = 0;
const totalTasks = 2_000_000_000;

const start = performance.now();
for (let i = 0; i < totalTasks; i++) {

    pool.submit("generatePrimes", {
        count: 20,
        start: 10_000_000_000 + i * 500,
        format: true,
        log: false
    }, (primes) => {
        // console.log("Primes generated:");
        console.log(performance.eventLoopUtilization());
        tasksDone++;
        // result = result.concat(primes)

        if (tasksDone === totalTasks) {
            console.log(`Time taken: ${performance.now() - start}ms`);
            console.log(result.sort());
        }
    });

}