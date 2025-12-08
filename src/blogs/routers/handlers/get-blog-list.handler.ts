import {Request, Response} from 'express';
import {BlogOutPut} from "../../types/blogOutPut";
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {InPutPaginationWithSearchName} from "../../../common/types/inPutPaginationWithSearchName";
import {blogsQueryRepository} from "../../repositories/blogs.queryRepository";
import {ObjectResult} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function getBlogListHandler(req: Request, res: Response) {

    const query: InPutPaginationWithSearchName = req.query;
    const blogs: ObjectResult<FinalWithPagination<BlogOutPut>> = await blogsQueryRepository.findAll(query);

    return res.status(resultCodeToHttpException(blogs.status)).send(blogs.data);
}