import {Request, Response} from 'express';
import {HttpStatus} from "../../../core/types/http-statuses";
import {commentsQueryRepository} from "../../../comments/repositories/comments.queryRepository";
import {InPutPagination} from "../../../common/types/inPutPagination";
import {postRepository} from "../../repositories/post.repository";
import {WithId} from "mongodb";
import {PostInDb} from "../../types/postInDb";


export async function getCommentsByPostId(req: Request, res: Response) {

    const postId = req.params.id;
    const query: InPutPagination = req.query;

    const post: WithId<PostInDb> | null = await postRepository.findById(postId);
    if (!post) {
        return res.sendStatus(HttpStatus.NotFound)
    }
    const comments = await commentsQueryRepository.findByPostId(postId, query);
    return res.status(HttpStatus.Ok).send(comments);

}