import {Request, Response} from 'express';
import {blogsQueryRepository} from "../../repositories/blogs.queryRepository";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";



export async function getBlogHandler(req: Request, res: Response) {

    const blogId = req.params.id;

    const blog = await blogsQueryRepository.findById(blogId);
    if(blog.status !== "Success") {
        return res.sendStatus(resultCodeToHttpException(blog.status))
    }

    return res.status(resultCodeToHttpException(blog.status)).send(blog.data);
}
