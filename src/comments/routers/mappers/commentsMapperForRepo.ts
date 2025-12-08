import {CommentInPut} from "../../types/commentInPut";
import {UserInDb} from "../../../users/types/userInDb";
import {ObjectId, WithId} from "mongodb";
import {CommentInDb} from "../../types/commentInDb";


export const commentsValueMaker = (postId: string, body: CommentInPut, user: WithId<UserInDb>): CommentInDb => {
    return {
        content: body.content,
        postId: new ObjectId(postId),
        commentatorInfo: {
            userId: user._id,
            userLogin: user.login,
        },
        createdAt: new Date(),
    }
}