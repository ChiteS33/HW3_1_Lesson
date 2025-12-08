import {Request, Response} from 'express';
import {InPutPagination} from "../../../common/types/inPutPagination";
import {PostOutPut} from "../../types/postOutPut";
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {postQueryRepository} from "../../repositories/post.queryRepository";


export async function getPostListHandler(req: Request, res: Response) {

    const query: InPutPagination = req.query
    const posts: FinalWithPagination<PostOutPut> = await postQueryRepository.findAll(query)

    res.send(posts);
}