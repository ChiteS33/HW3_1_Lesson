import {Request, Response} from 'express';
import {commentsRepository} from "../../repositories/comments.repository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {commentsServices} from "../../application/comments.service";
import {WithId} from "mongodb";
import {CommentInDb} from "../../types/commentInDb";


export async function deleteComment(req: Request, res: Response) {

    const commentId = req.params.id;
    const userLogin = req.user!.login

    const comment: WithId<CommentInDb> | null = await commentsRepository.findById(commentId)
    if (!comment) return res.sendStatus(HttpStatus.NotFound)
    if (userLogin !== comment.commentatorInfo.userLogin) return res.sendStatus(HttpStatus.Forbidden);

    await commentsServices.delete(commentId)
    res.sendStatus(HttpStatus.NoContent)
}