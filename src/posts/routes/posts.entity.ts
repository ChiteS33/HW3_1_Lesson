
import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {LikeDislikeStatus} from "../../comments/routers/comments.entity";



export type PostInDb = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId":string,
    "blogName": string,
    "createdAt": Date,
};

const postSchema = new mongoose.Schema<PostInDb>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: Date, required: true},
})
type PostModel = Model<PostInDb>

export type PostDocument = HydratedDocument<PostInDb>

export const PostModel = model<PostInDb, PostModel>("Posts", postSchema)





export type LikeInDbForPost = {
    userId: string,
    login: string,
    postId: string,
    status: LikeDislikeStatus,
    data: Date

}

const likeOrDislikeSchemaForPost = new mongoose.Schema<LikeInDbForPost>({
    userId: {type: String, required: true},
    login: {type: String, required: true},
    postId: {type: String, required: true},
    status:{type: String, required: true, enum: LikeDislikeStatus},
    data:{type: Date, required: true},
})

type LikeModel = Model<LikeInDbForPost>

export type LikeDocumentForPost = HydratedDocument<LikeInDbForPost>

export const LikeModelForPost = model<LikeInDbForPost, LikeModel>("Likes for post", likeOrDislikeSchemaForPost)