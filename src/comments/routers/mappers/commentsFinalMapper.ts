import {CommentOutPut} from "../../types/commentOutPut";
import {CommentDocument} from "../comments.entity";


export const commentMapper = (dto: CommentDocument): CommentOutPut => {
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

