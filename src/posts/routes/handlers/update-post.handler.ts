import {Request, Response} from 'express';
import {PostInputDto} from '../../types/post-input.dto';
import {postsServices} from "../../application/posts.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function updatePostHandler(req: Request, res: Response) {

    const postId: string = req.params.id;
    const body: PostInputDto = req.body;

    const result = await postsServices.update(postId, body);
            return res.sendStatus(resultCodeToHttpException(result.status))

}