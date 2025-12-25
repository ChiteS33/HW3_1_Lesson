import mongoose, {HydratedDocument, model, Model} from "mongoose";


export type CommentInDb = {
    content: string;
    postId: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: Date;
};


const commentSchema = new mongoose.Schema<CommentInDb>({
    content: {type: String, required: true},
    postId: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: Date, required: true},
})

type CommentModel = Model<CommentInDb>

export type CommentDocument = HydratedDocument<CommentInDb>

export const CommentModel = model<CommentInDb, CommentModel>("Comments", commentSchema)



export enum LikeDislikeStatus {
    like = "Like",
    dislike = "Dislike",
    None = "None",
}

export type LikeInDb = {
    userId: string,
    commentId: string,
    status: LikeDislikeStatus
}

const likeOrDislikeSchema = new mongoose.Schema<LikeInDb>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    status:{type: String, required: true, enum: LikeDislikeStatus},
})

type LikeModel = Model<LikeInDb>

export type LikeDocument = HydratedDocument<LikeInDb>

export const LikeModel = model<LikeInDb, LikeModel>("Likes", likeOrDislikeSchema)
