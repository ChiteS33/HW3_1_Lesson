import {Request, Response} from 'express';
import {postsServices} from "../../application/posts.service";
import {postQueryRepository} from "../../repositories/post.queryRepository";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function createPostHandler(req: Request, res: Response) {

    const body = req.body;

    const createdPostId = await postsServices.create(body);
    if (!createdPostId.data) {
        return res.sendStatus(resultCodeToHttpException(createdPostId.status));
    }
    const createdPost = await postQueryRepository.findById(createdPostId.data!);

    if(createdPost.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(createdPost.status));
    }

    return res.status(resultCodeToHttpException(ResultStatus.Created)).send(createdPost.data);
}
