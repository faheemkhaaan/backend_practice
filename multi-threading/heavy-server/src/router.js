// Controllers
const User = require("./controllers/user");
const generatePrimes = require("../lib/prime-generator");
const { performance } = require("perf_hooks");
const { Worker } = require("worker_threads");

module.exports = (server) => {


  server.route("get", "/api/get-json-data", (req, res) => {
    res.json({ data: "This is a big size json data".repeat(100) });
  })


  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.route("post", "/api/login", User.logUserIn);

  // Log a user out
  server.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  server.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  server.route("put", "/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ PRIME NUMBER ROUTES ************* //
  // ------------------------------------------------ //

  server.route("get", "/api/primes", (req, res) => {
    const count = req.params.get("count");
    let startingNumber = BigInt(req.params.get('start'));

    if (startingNumber < BigInt(Number.MAX_SAFE_INTEGER)) {
      startingNumber = Number(startingNumber);
    }
    const start = performance.now();
    const thread1 = new Worker('./lib/calc.js', { workerData: { count, start: startingNumber } });
    let result = []
    thread1.on("message", (prims) => {
      result = result.concat(prims);
    });

    thread1.on('exit', (code) => {
      if (code === 0) {
        const end = ((performance.now() - start) / 1000).toFixed(2);
        res.json({
          primes: result,
          time: end,
        });

      }
    })

  });
};
