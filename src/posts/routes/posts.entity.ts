import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument, model, Model} from "mongoose";

export type PostInDb = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": ObjectId,
    "blogName": string,
    "createdAt": Date,
};

const postSchema = new mongoose.Schema<PostInDb>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: ObjectId, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: Date, required: true},
})

type PostModel = Model<PostInDb>

export type PostDocument = HydratedDocument<PostInDb>

export const PostModel = model<PostInDb, PostModel>("Posts", postSchema)