import {Request, Response} from 'express';
import {commentsServices} from "../../application/comments.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function deleteComment(req: Request, res: Response) {

    const commentId = req.params.id;
    const userLogin = req.user!.login

    const result = await commentsServices.delete(commentId, userLogin);
    return res.sendStatus(resultCodeToHttpException(result.status));

}