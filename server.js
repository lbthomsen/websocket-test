/*
 * Development Server
 */

const express = require("express"),
    compression = require("compression"),
    expressWs = require('express-ws');

var app = express();
var ws = expressWs(app);

app.use(compression());

app.ws('/', function (ws, req) {
    console.log("Got Websocket request: " + req.path + " ", JSON.stringify(req.headers, null, 4));
    ws.on('message', function (msg) {
        console.log("Received: %j - responding", msg)
        ws.send(msg);
    });
});

app.use("/", function(req, res, next) {
    console.log("Got request: " + req.path + " ", JSON.stringify(req.headers, null, 4));
    next();
}, express.static("./"));

app.get('/*', function (req, res) {
    console.log("Got request: ", JSON.stringify(req.headers, null, 4));
    res.sendFile('index.html', { root: "./" });
});

app.listen(7000);

/*
 * vim: ts=4 et nowrap autoindent
 */