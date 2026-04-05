
const dns = require('node:dns/promises');


(async () => {
    const result = await dns.lookup('youtube.com');
    console.log(result);
})()