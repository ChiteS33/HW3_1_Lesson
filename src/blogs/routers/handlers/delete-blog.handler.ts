import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsServices} from "../../application/blogs.service";
import {blogsRepository} from "../../repositories/blogs.repository";
import {WithId} from "mongodb";
import {BlogInDb} from "../../types/blogInDb";

export async function deleteBlogHandler(req: Request, res: Response) {

    const id = req.params.id;
    const checkingBlog: WithId<BlogInDb> | null = await blogsRepository.findById(id)

    if (!checkingBlog) {
        res.sendStatus(HttpStatus.NotFound)
        return;
    }
    await blogsServices.delete(id);
     res.sendStatus(HttpStatus.NoContent);
}