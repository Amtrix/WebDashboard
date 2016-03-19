/// <reference path="../decls/jquery.d.ts" />
/// <reference path="../decls/require.d.ts" />
/// <reference path="../decls/socket.io-client.d.ts" />

declare var nbe: any;

import io = require("socket.io-client");

var socket: SocketIOClient.Socket;

function initNetwork(): void
{
    socket = io.connect();
}

var openFile: any = null;

function getFileId(file: any): string
{
    return file.dev + "." + file.shaHash;
}

function loadComments(): void
{
    if (!openFile) return;

    var id: string = getFileId(openFile);
    console.log("LOAD: " + openFile.relPath + "/" + id);

    socket.emit("get-comments", id);

    socket.once("get-comments-success", (res: string) => {
        $("#editor").val(res);
    });
}

function saveComments(): void
{
    if (!openFile) return;

    var id: string = getFileId(openFile);
    console.log("SAVE: " + openFile.relPath + "/" + id);

    socket.emit("save-comments", id, $("#editor").val())
}

function startClock(): void
{
    setInterval(() => {
        var d = new Date();
        var sec = d.getSeconds();
        var str: string = d.getHours() + ":"
                        + d.getMinutes() + ":"
                        + (sec < 10 ? "0" + sec : sec);
        $("#clock").text(str);
    }, 1000);
}

$(() =>
{
    initNetwork();

    console.log();
    (<any>$("#filemng")[0]).contentWindow.fileClick = (file: any) => {
        saveComments();
        openFile = file;
        loadComments();
        $("#view-pdf").attr("src","client/pdfjs/web/viewer.html?file=/data" + file.relPath);
    };

    loadComments();
    setInterval(() => { saveComments(); }, 5000);
    startClock();
});