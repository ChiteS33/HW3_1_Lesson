import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsServices} from "../../application/blogs.service";
import {blogsRepository} from "../../repositories/blogs.repository";


export async function updateBlogHandler(req: Request, res: Response) {

    const id = req.params.id;
    const body = req.body;

    const blog = await blogsRepository.findById(id);
    if (!blog) {
        return res.sendStatus(HttpStatus.NotFound)
    }
    await blogsServices.update(id, body);
    return res.sendStatus(HttpStatus.NoContent);

}