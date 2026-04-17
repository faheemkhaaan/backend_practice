const { Worker, isMainThread, threadId } = require('worker_threads');



if (isMainThread) {
    const worker = new Worker('./isMainTread.js');
    console.log("This is the main thread with id:", threadId)
} else {
    console.log("This is a worker thread with id:", threadId)
}