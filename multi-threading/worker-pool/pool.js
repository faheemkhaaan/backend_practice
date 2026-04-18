
const { Worker } = require("worker_threads");
const path = require("path");

class Pool {
    constructor(threadCount) {
        this.threadCount = threadCount; // number of threads that will be spawned
        this.threads = []; // all of our worker threads (same length as threadCount)
        this.idleThreads = [] // threads that are not currently working
        this.scheduledTasks = []; // queue of tasks that need to be executed - these are not curently running in on of the threads

        for (let i = 0; i < threadCount; i++) {
            this.spawnThread();
        }

    }
    spawnThread() {
        const worker = new Worker(path.join(__dirname, "./calc.js"));

        // when we get a message from a worker, it means that it has finished its task
        worker.on("message", (result) => {

            const { callback } = worker.currentTask;
            if (callback) {
                callback(result);
            }
            this.idleThreads.push(worker);
            this.runNextTask();
        });

        this.threads.push(worker);
        this.idleThreads.push(worker);// initially all threads are idle
    }

    runNextTask() {
        if (this.scheduledTasks.length > 0 && this.idleThreads.length > 0) {
            const worker = this.idleThreads.shift();
            const { taskName, options, callback } = this.scheduledTasks.shift();

            // Tell a worker to start executing the task
            worker.currentTask = { taskName, options, callback };
            worker.postMessage({ taskName, options });
        }
    }

    submit(taskName, options, callback) {
        this.scheduledTasks.push({
            taskName,
            options,
            callback
        });
        this.runNextTask();
    }

}




module.exports = Pool