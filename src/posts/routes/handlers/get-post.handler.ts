import {Request, Response} from 'express';
import {postQueryRepository} from "../../repositories/post.queryRepository";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";

export async function getPostHandler(req: Request, res: Response) {

    const postId = req.params.id;

    const foundPost = await postQueryRepository.findById(postId);
    if (foundPost.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(foundPost.status));
    }
    return res.status(resultCodeToHttpException(foundPost.status)).send(foundPost.data);

}