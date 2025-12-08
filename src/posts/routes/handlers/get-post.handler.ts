import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';

import {postQueryRepository} from "../../repositories/post.queryRepository";

export async function getPostHandler(req: Request, res: Response) {

    const id = req.params.id;

    const checkingPost = await postQueryRepository.findById(id);
    if (!checkingPost) {
        return res.sendStatus(HttpStatus.NotFound);
    }
    return res.status(HttpStatus.Ok).send(checkingPost);

}