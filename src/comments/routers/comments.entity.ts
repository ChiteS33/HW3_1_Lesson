import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument, model, Model} from "mongoose";


export type CommentInDb = {
    content: string;
    postId: ObjectId;
    commentatorInfo: {
        userId: ObjectId;
        userLogin: string;
    },
    createdAt: Date;
};


const commentSchema = new mongoose.Schema<CommentInDb>({
    content: {type: String, required: true},
    postId: {type: ObjectId, required: true},
    commentatorInfo: {
        userId: {type: ObjectId, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: Date, required: true},
})

type CommentModel = Model<CommentInDb>

export type CommentDocument = HydratedDocument<CommentInDb>

export const CommentModel = model<CommentInDb, CommentModel>("Comments", commentSchema)