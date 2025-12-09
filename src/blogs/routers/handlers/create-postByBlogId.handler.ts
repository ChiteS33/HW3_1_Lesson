import {Request, Response} from "express";
import {PostOutPut} from "../../../posts/types/postOutPut";
import {postsServices} from "../../../posts/application/posts.service";
import {postQueryRepository} from "../../../posts/repositories/post.queryRepository";
import {ObjectResult, ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function createPostByBlogIdHandler(req: Request, res: Response,) {

    const blogId = req.params.id;
    const body = req.body;


    const createResult: ObjectResult <string | null> = await postsServices.createPostByBlogId(blogId, body)

    if( createResult.status !== "Created" ){
        return res.sendStatus(resultCodeToHttpException(createResult.status));
    }
    const createdPost: ObjectResult<PostOutPut | null> = await postQueryRepository.findById(createResult.data!)
    console.log(createdPost)
    if(createdPost.status !== "Success" ){
        return res.sendStatus(resultCodeToHttpException(createResult.status));
            }

    return res.status(resultCodeToHttpException(ResultStatus.Created)).send(createdPost.data)
}