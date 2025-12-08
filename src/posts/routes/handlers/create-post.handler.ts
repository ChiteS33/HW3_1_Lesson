import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {PostOutPut} from "../../types/postOutPut";
import {postsServices} from "../../application/posts.service";
import {postQueryRepository} from "../../repositories/post.queryRepository";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";


export async function createPostHandler(req: Request, res: Response) {

    const body = req.body;
    const BlogId = req.body.blogId;
    const blog = await blogsRepository.findById(BlogId);
    if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const createdPostId: string = await postsServices.create(body, blog);

    const createdPost: PostOutPut | null = await postQueryRepository.findById(createdPostId);
    if (!createdPost) {
        return res.sendStatus(HttpStatus.NotFound)
    }


    return res.status(HttpStatus.Created).send(createdPost);
}
