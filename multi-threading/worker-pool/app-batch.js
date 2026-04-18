
const Pool = require("./pool");
const { performance } = require("perf_hooks");
const numberWorker = 4;
const pool = new Pool(numberWorker);


let result = []
let tasksDone = 0;
const totalTasks = 20_000;
const batchSize = 1_000;
let batchIndex = 0;


function submitBatch(startIndex, endIndex) {
    let batchTaskCount = 0;
    const start = performance.now();
    for (let i = startIndex; i < endIndex; i++) {
        batchTaskCount++
        pool.submit("generatePrimes", {
            count: 20,
            start: 10_000_000_000 + i * 500,
            format: true,
            log: false
        }, (primes) => {
            // console.log("Primes generated:");
            // console.log(performance.eventLoopUtilization());
            tasksDone++;
            batchTaskCount--
            // result = result.concat(primes)
            // when all tasks are done
            if (tasksDone === totalTasks) {
                console.log(`Time taken: ${performance.now() - start}ms`);
                console.log(result.sort());
            }

            // when all batch tasks are done
            if (batchTaskCount === 0) {
                batchIndex++
                submitNextBatch()
            }
        });

    }
}

function submitNextBatch() {
    if (batchIndex * batchSize < totalTasks) {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min((batchIndex + 1) * batchSize, totalTasks);

        submitBatch(startIndex, endIndex);
    }

}
submitNextBatch()

