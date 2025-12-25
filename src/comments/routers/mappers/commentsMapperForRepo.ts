import {CommentInPut} from "../../types/commentInPut";
import {CommentInDb} from "../comments.entity";



export const commentsValueMaker = (postId: string, body: CommentInPut, userLogin: string, userId: string): CommentInDb => {
    return {
        content: body.content,
        postId: postId,
        commentatorInfo: {
            userId: userId ,
            userLogin: userLogin,
        },
        createdAt: new Date(),
    }
}