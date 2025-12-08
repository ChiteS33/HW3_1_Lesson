import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {commentsServices} from "../../../comments/application/comments.service";
import {WithId} from "mongodb";
import {postRepository} from "../../repositories/post.repository";
import {PostInDb} from "../../types/postInDb";
import {commentsQueryRepository} from "../../../comments/repositories/comments.queryRepository";
import {CommentInPut} from "../../../comments/types/commentInPut";
import {UserInDb} from "../../../users/types/userInDb";


export async function createCommentHandler(req: Request, res: Response) {

    const user: WithId<UserInDb> = req.user!
    const postId = req.params.id;
    const content: CommentInPut = req.body;

    const post: WithId<PostInDb> | null = await postRepository.findById(postId);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const commentId: string = await commentsServices.create(user, content, postId);

    const comment = await commentsQueryRepository.findById(commentId);


    res.status(HttpStatus.Created).send(comment);
}

