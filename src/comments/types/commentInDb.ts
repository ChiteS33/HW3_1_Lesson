import {ObjectId} from "mongodb";

export type CommentInDb = {
    content: string;
    postId: ObjectId;
    commentatorInfo: {
        userId: ObjectId;
        userLogin: string;
    },
    createdAt: Date;
};