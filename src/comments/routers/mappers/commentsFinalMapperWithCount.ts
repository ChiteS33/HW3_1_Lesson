import {CommentDocument} from "../comments.entity";


export const commentsFinalMapperWithCount = (comment: CommentDocument, counter: any): any => {



    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: counter.totalCountLike,
            dislikesCount: counter.totalCountDislike,
            myStatus: counter.myStatus,
                    }
    }
}