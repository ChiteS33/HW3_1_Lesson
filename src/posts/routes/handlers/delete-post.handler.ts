import {Request, Response} from 'express';
import {postsServices} from "../../application/posts.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";

export async function deletePostHandler(req: Request, res: Response) {
    const postId = req.params.id;

    const result = await postsServices.delete(postId)
    return res.sendStatus(resultCodeToHttpException(result.status));
}