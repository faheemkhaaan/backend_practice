
const Butter = require('../butter');


const PORT = 8000;
// A sample object in this array would look like
// { userId: 1, token: 213123 }
const SESSIONS = [
    { token: 4398082, userId: 1 }
];


const USERS = [
    { id: 1, name: 'Liam Brown', username: "liam23", password: "string" },
    { id: 2, name: 'Meredith Green', username: "merit.sky", password: "string" },
    { id: 3, name: 'Ben Adams', username: "ben.poet", password: "string" },
];

const POSTS = [
    {
        id: 1,
        title: "This is a post",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        userId: 1,
    }
];

const server = new Butter();

// Authentication
server.beforeEach((req, res, next) => {
    console.log("This is the first middleware function")

    const routesToAuthenticate = [
        "GET /api/user",
        "PUT /api/user",
        "POST /api/posts",
        "DELETE /api/logout"
    ];
    const route = req.method + " " + req.url;
    console.log(route);
    const protectedRoute = routesToAuthenticate.indexOf(route);
    console.log(protectedRoute);

    if (protectedRoute !== -1) {

        // if we have a token cookie, then save the userId to the req object
        if (req.headers.cookie) {

            const token = req.headers.cookie.split("=")[1];
            const session = SESSIONS.find(session => session.token === Number(token));
            console.log(session);
            if (session) {
                req.userId = session.userId;
            }
            return next();
        } else {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
    } else {
        return next()
    }

});

const parseJSON = (req, res, next) => {

    if (req.headers["content-type"] === "application/json") {
        let body = ""
        req.on("data", (chunk) => {
            body += chunk.toString("utf-8")
        });

        req.on("end", () => {
            body = JSON.parse(body);
            req.body = body;
            return next()
        });
    } else {
        next()
    }
}

server.beforeEach(parseJSON);

// For different routes the need the index.html file
server.beforeEach((req, res, next) => {
    console.log("This is the third middleware function");

    const routes = ["/", "/login", "/profile", "/new-post"];

    const routeExists = routes.indexOf(req.url) !== -1 && req.method === "GET";
    if (routeExists) {
        console.log(res.status);
        res.status(200).sendFile("./public/index.html", "text/html");
        return;
    } else {

        next()
    }

})



// ----------Files Routes -----------//

server.route("get", '/styles.css', (req, res) => {
    res.sendFile("./public/styles.css", 'text/css');
});

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', 'text/javascript')
});

// ----------JSON Routes -----------//

// Sends the list of all post to the user
server.route("get", '/api/posts', (req, res) => {
    const posts = POSTS.map((p) => {
        const user = USERS.find(u => u.id === p.userId);
        p.author = user.name;
        return p;
    })
    res.status(200).json(posts);
});

// Send user info
server.route("get", "/api/user", (req, res) => {
    const user = USERS.find(u => u.id === req.userId);
    res.status(200).json(user);
});


// Log a user in and give them a token
server.route('post', "/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //check if user exists
    const user = USERS.find(user => user.username === username);
    // check the password if the user was found;

    if (user && user.password === password) {
        // At this point, we know the client is who they say they are
        // Generate a random 10 digit token
        const token = Math.floor(Math.random() * 10000000).toString();
        // Save the generated token
        SESSIONS.push({ userId: user.id, token: token });

        res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
        res.status(200).json({ message: "Logged in successfully" });
    } else {
        res.status(401).json({ error: "Invalid username or password" });
    }

});

// Log a user out and delete the user session

server.route("delete", "/api/logout", (req, res) => {
    // Remove the session object from the SESSION array;

    const sessionIndex = SESSIONS.findIndex(session => session.userId === req.userId);

    if (sessionIndex > -1) {
        SESSIONS.splice(sessionIndex, 1);
    };

    res.setHeader("Set-Cookie", `token=deleted;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.status(200).json({ message: "Logged out successfully" });

});

// Update user 
server.route("put", "/api/user", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;

    const user = USERS.find(u => u.id === req.userId);

    user.name = name;
    user.username = username;

    const shouldUpdatePassword = !!password.trim();
    if (shouldUpdatePassword) {
        user.password = password;
    }
    res.status(200).json(user);
});


// Create a new post
server.route("post", "/api/posts", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;

    const post = {
        id: POSTS.length + 1,
        title,
        body,
        userId: req.userId
    };

    POSTS.unshift(post);
    res.status(201).json(post);

})




server.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});

