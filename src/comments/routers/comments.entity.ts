import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {CommentInPut} from "../types/commentInPut";


export type CommentInDb = {
    content: string;
    postId: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: Date;
};

export type CommentatorInfo = {
    userId: string;
    userLogin: string;
}

type CommentStatics = typeof CommentEntity

interface CommentMethods {
    updateComment(foundComment: CommentDocument, body: CommentInPut): void;

}


const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
})

const commentSchema = new mongoose.Schema<CommentInDb>({
    content: {type: String, required: true},
    postId: {type: String, required: true},
    commentatorInfo: {type: commentatorInfoSchema},
    createdAt: {type: Date, required: true},
})

class CommentEntity {
    private constructor(
        public content: string,
        public postId: string,
        public commentatorInfo: CommentatorInfo,
        public createdAt: Date
    ) {
    }

    static createComment(userLogin: string, userId: string, body: CommentInPut, postId: string) {
        const commentInfo = {
            userId: userId,
            userLogin: userLogin
        }
        const newComment = new CommentModel()
        newComment.content = body.content
        newComment.postId = postId;
        newComment.commentatorInfo = commentInfo
        newComment.createdAt = new Date()
         return newComment
    }

    updateComment(foundComment: CommentDocument | null, body: CommentInPut){
        this.content = body.content
            }


}

commentSchema.loadClass(CommentEntity)

type CommentModel = Model<CommentInDb, {}, CommentMethods> & CommentStatics

export type CommentDocument = HydratedDocument<CommentInDb, CommentMethods>

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
    status: {type: String, required: true, enum: LikeDislikeStatus},
})


type LikeModel = Model<LikeInDb>

export type LikeDocument = HydratedDocument<LikeInDb>

export const LikeModel = model<LikeInDb, LikeModel>("Likes", likeOrDislikeSchema)
