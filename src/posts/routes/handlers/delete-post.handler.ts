import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {postsServices} from "../../application/posts.service";
import {postRepository} from "../../repositories/post.repository";
import {WithId} from "mongodb";
import {PostInDb} from "../../types/postInDb";

export async function deletePostHandler(req: Request, res: Response) {
    const id = req.params.id;
    const post: WithId<PostInDb> | null = await postRepository.findById(id);
    if (!post) {
        return res.sendStatus(HttpStatus.NotFound)
    }
    await postsServices.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}