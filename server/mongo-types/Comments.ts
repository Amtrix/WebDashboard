/// <reference path="../../decls/mongoose.d.ts" />

import mongoose = require("mongoose");

export interface Comments {
    uid: string,
    content: string
};

// how to handle geo types with mongoose
// http://stackoverflow.com/questions/15556624/how-does-one-represent-mongodb-geojson-fields-in-a-mongoose-schema

var commentsSchema = new mongoose.Schema(
{
    uid: String,
    content: String
}, { minimize: false });


interface IComments extends Comments {};

export namespace CommentsDB
{
    export interface tsType extends IComments, mongoose.Document { };

    export var portal = mongoose.model<tsType>('Comment', commentsSchema);
}