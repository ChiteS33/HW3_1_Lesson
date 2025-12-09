import {Request, Response} from 'express';
import {commentsQueryRepository} from "../../../comments/repositories/comments.queryRepository";
import {InPutPagination} from "../../../common/types/inPutPagination";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function getCommentsByPostId(req: Request, res: Response) {

    const postId = req.params.id;
    const query: InPutPagination = req.query;

    const comments = await commentsQueryRepository.findByPostId(postId, query);
    if(comments.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(comments.status));
    }

    return res.status(resultCodeToHttpException(comments.status)).send(comments.data);

}