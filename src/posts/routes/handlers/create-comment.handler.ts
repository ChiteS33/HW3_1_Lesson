import {Request, Response} from 'express';
import {commentsServices} from "../../../comments/application/comments.service";
import {WithId} from "mongodb";
import {commentsQueryRepository} from "../../../comments/repositories/comments.queryRepository";
import {CommentInPut} from "../../../comments/types/commentInPut";
import {UserInDb} from "../../../users/types/userInDb";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function createCommentHandler(req: Request, res: Response) {

    const user: WithId<UserInDb> = req.user!
    const postId = req.params.id;
    const content: CommentInPut = req.body;

    const commentId = await commentsServices.create(user, content, postId);
    if (commentId.status !== ResultStatus.Created) {
        return res.sendStatus(resultCodeToHttpException(commentId.status))
    }
    const comment = await commentsQueryRepository.findById(commentId.data!);
    if (comment.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(commentId.status))
    }

    return res.status(resultCodeToHttpException(comment.status)).send(comment.data);
}

