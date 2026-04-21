

process.title = "event_loop"
let count = 0;

function checkStack() {
    count++;
    console.log(count)
    setImmediate(() => {
        checkStack();
    })
}
checkStack()
// process.nextTick(() => {
//     console.log('tick')
// })