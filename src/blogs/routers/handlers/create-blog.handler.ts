import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/http-statuses';
import {blogsServices} from "../../application/blogs.service";
import {BlogInputDto} from "../../types/blogInPutDto";
import {blogsQueryRepository} from "../../repositories/blogs.queryRepository";
import {BlogOutPut} from "../../types/blogOutPut";
import {ObjectResult} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function createBlogHandler(req: Request, res: Response) {

    const createBlogData: BlogInputDto = req.body
    const createdBlog: ObjectResult<string> = await blogsServices.create(createBlogData);

    const foundBlog: ObjectResult<BlogOutPut | null> = await blogsQueryRepository.findById(createdBlog.data);
    if (foundBlog.status !== "Created") {
        return  res.sendStatus(HttpStatus.InternalServerError)
    }

    return  res.status(resultCodeToHttpException(foundBlog.status)).send(foundBlog.data);
}