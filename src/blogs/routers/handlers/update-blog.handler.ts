import {Request, Response} from 'express';
import {blogsServices} from "../../application/blogs.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function updateBlogHandler(req: Request, res: Response) {

    const id = req.params.id;
    const body = req.body;

    const blog = await blogsServices.findById(id);
    if(blog.status !== "Created"){
        return res.sendStatus(resultCodeToHttpException(blog.status));
    }

    await blogsServices.update(id, body);
    return res.sendStatus(resultCodeToHttpException(blog.status));

}