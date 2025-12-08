import {Request, Response} from 'express';
import {HttpStatus} from "../../../core/types/http-statuses";
import {commentsQueryRepository} from "../../repositories/comments.queryRepository";


export async function getCommentById(req: Request, res: Response) {

    const id = req.params.id;

    const comment = await commentsQueryRepository.findById(id);
    if (!comment) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).send(comment);
}
