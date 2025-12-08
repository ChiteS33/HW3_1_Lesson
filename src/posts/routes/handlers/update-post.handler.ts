import {Request, Response} from 'express';
import {PostInputDto} from '../../types/post-input.dto';
import {HttpStatus} from '../../../core/types/http-statuses';
import {postRepository} from '../../repositories/post.repository';
import {postsServices} from "../../application/posts.service";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";


export async function updatePostHandler(req: Request, res: Response) {

    const postId: string = req.params.id;
    const body: PostInputDto = req.body;
    const blogId: string = req.body.blogId;

    const post = await postRepository.findById(postId);
    if (!post) return res.sendStatus(HttpStatus.NotFound);

    const blog = await blogsRepository.findById(blogId);
    if (!blog) return res.sendStatus(HttpStatus.NotFound)


    await postsServices.update(postId, body);
    return res.sendStatus(HttpStatus.NoContent)
}