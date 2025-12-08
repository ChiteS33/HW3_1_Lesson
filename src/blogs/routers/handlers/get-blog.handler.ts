import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsQueryRepository} from "../../repositories/blogs.queryRepository";



export async function getBlogHandler(req: Request, res: Response) {

    const blogId = req.params.id;

    const blog = await blogsQueryRepository.findById(blogId);
    if (!blog) {
        return res.sendStatus(HttpStatus.NotFound)
    }

    return res.status(HttpStatus.Ok).send(blog);
}
