const http = require("http");


// Send one request
function sendRequest(hostname, port, path, method, body = null) {
  return new Promise((resolve, reject) => {

    let postData = ''
    const headers = {}
    if (body) {
      const { userId, ...postBody } = body;

      if (!userId) {
        throw new Error(`UserId not defined ${userId}`)
      }
      postData = JSON.stringify(postBody);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
      headers['X-Auth-User-Id'] = userId;
    }

    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: method,
      headers: headers
    };


    const req = http.request(options, (res) => {
      const chunks = [];
      const statusCode = res.statusCode;

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const responseBody = Buffer.concat(chunks).toString();
        if (statusCode < 200 || statusCode >= 300) {
          console.error(statusCode);
          console.log(responseBody);
        }
        resolve(Buffer.concat(chunks).toString());
      });
    });

    req.on("error", (e) => {
      console.log(e);
      reject(e);
    });

    if (body) {
      req.write(postData);
    }


    req.end();
  });
}

module.exports = sendRequest;
