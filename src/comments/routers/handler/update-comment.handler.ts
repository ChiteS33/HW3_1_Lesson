import {Request, Response} from 'express';
import {commentsServices} from "../../application/comments.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function updateComment(req: Request, res: Response) {

    const commentId = req.params.id;
    const body = req.body;
    const userLogin = req.user!.login;

    const updatedCommentResult = await commentsServices.update(commentId, body, userLogin)

    return res.sendStatus(resultCodeToHttpException(updatedCommentResult.status));
}

