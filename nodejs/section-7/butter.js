

const http = require("node:http");
const fs = require('node:fs')
class Butter {

    constructor() {
        const s = http.createServer();

        /**
         * @type {http.Server<typeof http.IncomingMessage,typeof http.ServerResponse>}
         */
        this.server = http.createServer();

        this.routes = {};
        this.middlewares = [];


        this.server.on('request', (req, res) => {
            const butterResponse = new ButterResponse(res);




            const runMiddleWares = (req, res, middleware, index) => {
                // Our exit point...
                if (index === middleware.length) {
                    const route = req.method.toLowerCase() + req.url;
                    const routeExist = this.routes.hasOwnProperty(route);
                    if (!routeExist) {
                        res.status(404);
                        res.json({ error: `Cannot ${req.method} ${req.url}` });
                        return;
                    }
                    this.routes[route.trim()](req, res);

                } else {
                    middleware[index](req, res, () => {
                        runMiddleWares(req, res, middleware, index + 1)
                    })
                }
            }


            runMiddleWares(req, butterResponse, this.middlewares, 0);




            // Run all the middleware function before we run the coresponding routes
        })
    };


    /**
     * 
     * @param {"get" | "post" |"put" | "delete"} method 
     * @param {String} path 
     * @param {function(import("http").IncomingMessage,ButterResponse):void} cb 
     */
    route(method, path, cb) {
        const route = method + path;
        this.routes[route.trim()] = cb;
    }

    /**
     * 
     * @param {function(import("http").IncomingMessage,ButterResponse,function)} cb 
     */
    beforeEach(cb) {
        this.middlewares.push(cb);
    }

    /**
     * 
     * @param {Number} port 
     * @param {Function} cb 
     */
    listen = (port, cb) => {
        this.server.listen(port, cb)
    }
}

class ButterResponse {
    /**
     * 
     * @param {http.ServerResponse} res 
     */
    constructor(res) {

        this.res = res;
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return target[prop]
                }
                const value = target.res[prop];
                return typeof value === 'function' ? value.bind(target.res) : value;
            }
        })
    };

    status(code) {
        this.res.statusCode = code;
        return this;
    }

    json(data) {
        this.res.setHeader("Content-Type", "application/json");
        this.res.end(JSON.stringify(data));
    }

    sendFile(path, contentType) {
        this.res.setHeader('Content-Type', contentType);
        const fileStream = fs.createReadStream(path);
        fileStream.on('error', (err) => {
            console.log(err);
            this.status(404);
            this.res.end("File not found");
        });
        fileStream.pipe(this.res);
        return this
    }

}

module.exports = Butter;