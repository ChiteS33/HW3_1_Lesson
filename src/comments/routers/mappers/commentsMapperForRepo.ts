import {CommentInPut} from "../../types/commentInPut";
import {ObjectId} from "mongodb";
import {CommentInDb} from "../comments.entity";



export const commentsValueMaker = (postId: string, body: CommentInPut, userLogin: string, userId: string): CommentInDb => {
    return {
        content: body.content,
        postId: new ObjectId(postId),
        commentatorInfo: {
            userId: new ObjectId(userId) ,
            userLogin: userLogin,
        },
        createdAt: new Date(),
    }
}