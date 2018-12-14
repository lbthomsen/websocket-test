/*
 * Development Server
 */

const express = require("express"),
    compression = require("compression"),
    expressWs = require('express-ws');

var app = express();
var ws = expressWs(app);

app.use(compression());

app.ws('/echo', function (ws, req) {
    ws.on('message', function (msg) {
        console.log("Received: %j - responding", msg)
        ws.send(msg);
    });
});

app.use("/", express.static("./"));

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: "./" });
});

app.listen(7000);

/*
 * vim: ts=4 et nowrap autoindent
 */