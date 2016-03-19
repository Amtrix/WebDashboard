/// <reference path="../decls/node.d.ts" />
/// <reference path="../decls/mongodb.d.ts" />
/// <reference path="../decls/express.d.ts" />
/// <reference path="../decls/socket.io.d.ts" />
/// <reference path="../decls/express-session.d.ts" />
/// <reference path="../decls/body-parser.d.ts" />
/// <reference path="../decls/jquery.d.ts" />
/// <reference path="../decls/mongoose.d.ts" />
/// <reference path="../decls/bcrypt.d.ts" />
/// <reference path="../decls/cookie-parser.d.ts" />
/// <reference path="../decls/async.d.ts" />
/// <reference path="../decls/googlemaps.d.ts" />
/// <reference path="../decls/multer.d.ts" />
/// <reference path="../decls/ejs.d.ts" />
/// <reference path="../shared/types.ts" />

// config
var confAppIp: string = "localhost";
var confAppPort: number = process.env.PORT || 8421;

var validUrl = require('valid-url');
var koa = require("koa");
var koaStatic = require('koa-static');
var http = require("http");
import express = require("express");
import socketio = require("socket.io");
import session = require("express-session");
import fs = require("fs");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import async = require('async');
import ejs = require('ejs');
import multer = require("multer");


var path = require("path");
var og = require("open-graph");
var MongoStore = require('connect-mongo')(session);

import { CommentsDB } from "./mongo-types/Comments";

// start running the chat server //

type Socket = SocketIO.Socket;

console.log("");
console.log("***********************");
console.log("*                     *");
console.log("*    Dashboard server *");
console.log("*                     *");
console.log("***********************");
console.log("");

// mongoose
namespace MongoSetup
{
    mongoose.connect('mongodb://localhost/dashboard');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(callback: any) { console.log("connection to mongodb: ok.") });
}

// APP
var app = koa();
var server = http.createServer(app.callback()).listen(confAppPort);
var io = socketio.listen(server);

namespace PageSetup
{
   app.use(koaStatic("build/client"));
}

var comments: any = { };

io.on('connection', socket =>
{
    socket.on("get-comments", (id: string) => {
        CommentsDB.portal.findOne({"uid": id}, (err: any, res: any) => {
            socket.emit("get-comments-success", res == null ? "" : res.content);
        });
    });

    socket.on("save-comments", (id: string, content: string) => {
        CommentsDB.portal.findOne({"uid": id}, (err: any, res: any) => {
            if (res == null) {
                var comm = new CommentsDB.portal({
                    uid: id,
                    content: content
                });
                comm.save();
            } else {
                res.content = content;
                res.save();
            }
        });
    });

    socket.on('disconnect', () =>
    {
    });
});

console.log("Running on port: " + confAppPort);
require("./filemng/lib/index")(app);