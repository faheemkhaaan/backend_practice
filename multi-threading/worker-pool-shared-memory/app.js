
const Pool = require("./pool");
const { performance } = require("perf_hooks");
const numberWorker = 4;


let result = []
let tasksDone = 0;
const totalTasks = 20_000;
const count = 20;
const batchSize = 1_000;
let batchIndex = 0;
const pool = new Pool(numberWorker, totalTasks * count);


function clearLine(dir) {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

function moveCursor(dx, dy) {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        })
    })
}

function submitBatch(startIndex, endIndex) {
    let batchTaskCount = 0;
    const start = performance.now();
    for (let i = startIndex; i < endIndex; i++) {
        batchTaskCount++
        pool.submit("generatePrimes", {
            count: count,
            start: 10_000_000_000n + BigInt(i * 500),
            format: false,
            log: false
        },
            async (result) => {
                // console.log("Primes generated:");
                // console.log(performance.eventLoopUtilization());
                if (tasksDone % 100 === 0) {
                    await moveCursor(0, -1);
                    await clearLine(0);
                    await moveCursor(0, -1);
                    await clearLine(0);

                    console.log(
                        `Event loop utilization: ${performance.eventLoopUtilization().utilization
                        }`
                    );

                    console.log(
                        `Progress ${Math.round((tasksDone / totalTasks) * 100)}`
                    )
                }
                tasksDone++;
                batchTaskCount--
                // result = result.concat(primes)
                // when all tasks are done
                if (tasksDone === totalTasks) {
                    console.log(`Time taken: ${performance.now() - start}ms`);

                    console.log(pool.getPrimes()[999])
                    console.log(pool.getPrimes())
                    process.exit(0);
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

