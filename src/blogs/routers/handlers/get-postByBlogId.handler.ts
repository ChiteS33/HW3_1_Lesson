import {Request, Response} from 'express';
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {PostOutPut} from "../../../posts/types/postOutPut";
import {postQueryRepository} from "../../../posts/repositories/post.queryRepository";
import {blogsServices} from "../../application/blogs.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ObjectResult} from "../../../common/types/objectResultTypes";


export async function getPostByBlogIdHandler(req: Request, res: Response,) {

    const blogId = req.params.id;
    const query = req.query;

    const foundBlog = await blogsServices.findById(blogId)
    if(foundBlog.status !== "Success"){
        return res.sendStatus(resultCodeToHttpException(foundBlog.status))
    }

    const post: ObjectResult<FinalWithPagination<PostOutPut>> = await postQueryRepository.findPostsByBlogId(blogId, query) //

    return res.status(resultCodeToHttpException(post.status)).send(post.data);
}