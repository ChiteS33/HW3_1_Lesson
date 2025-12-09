import {Request, Response} from 'express';
import {InPutPagination} from "../../../common/types/inPutPagination";
import {postQueryRepository} from "../../repositories/post.queryRepository";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function getPostListHandler(req: Request, res: Response) {

    const query: InPutPagination = req.query

    const posts = await postQueryRepository.findAll(query)
    if (posts.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(posts.status))
    }
    return res.status(resultCodeToHttpException(posts.status)).send(posts.data)
}