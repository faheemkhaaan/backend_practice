
const { parentPort, workerData } = require("worker_threads");
const generatePrimes = require("./prime-generator");
const calculateFactorial = require("./factorial");

const primes = new BigUint64Array(workerData.primes);
const primesSeal = new Int32Array(workerData.primesSeal);

function lock(seal) {
    while (Atomics.compareExchange(seal, 0, 0, 1) === 1) {
        Atomics.wait(seal, 0, 1);
    }
}

function unlock(seal) {
    Atomics.store(seal, 0, 0);
    Atomics.notify(seal, 0, 1);
}

parentPort.on('message', ({ taskName, options }) => {
    switch (taskName) {
        case "generatePrimes":
            const generatedPrimes = generatePrimes(options.count, options.start, {
                format: options.format,
                log: options.log
            });


            lock(primesSeal);
            primes.set(generatedPrimes, primes.indexOf(0n));
            unlock(primesSeal)
            parentPort.postMessage("done");



            break;
        case "factorial":
            const result = calculateFactorial(options.n);
            parentPort.postMessage(result);
            break;
        default:
            parentPort.postMessage('Unkown task');
    }
})