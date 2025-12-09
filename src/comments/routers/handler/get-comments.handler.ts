import {Request, Response} from 'express';
import {commentsQueryRepository} from "../../repositories/comments.queryRepository";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function getCommentById(req: Request, res: Response) {

    const commentId = req.params.id;

    const comment = await commentsQueryRepository.findById(commentId);

    if (comment.status !== "Success") {
        return res.sendStatus(resultCodeToHttpException(comment.status));
    }

    return res.status(resultCodeToHttpException(comment.status)).send(comment.data);
}
