

const fsPromise = require("fs/promises");


(async ()=>{
    try {
        await fsPromise.copyFile("file.txt","copied-promise.txt");
    } catch (error) {
        console.log(error)
    };
})()

const fsCallback = require("fs");

fsCallback.copyFile('file.txt',"copy-callback.txt",(error)=>{
    if(error)console.log(error);
});


const fsSync = require("fs");


fsSync.copyFileSync('file.txt',"copy-sync.txt");