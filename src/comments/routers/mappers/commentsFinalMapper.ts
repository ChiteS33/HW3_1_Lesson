import {CommentInDb} from "../../types/commentInDb";
import {WithId} from "mongodb";
import {CommentOutPut} from "../../types/commentOutPut";


export const commentMapp = (dto: WithId<CommentInDb>): CommentOutPut => {
    return {
        id: dto._id.toString(),
        content: dto.content,
        commentatorInfo: {
            userId: dto.commentatorInfo.userId.toString(),
            userLogin: dto.commentatorInfo.userLogin
        },
        createdAt: dto.createdAt.toISOString(),
    }

}