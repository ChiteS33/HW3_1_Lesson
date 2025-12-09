import {Request, Response} from 'express';
import {blogsServices} from "../../application/blogs.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";

export async function deleteBlogHandler(req: Request, res: Response) {

    const id = req.params.id;
    const blog = await blogsServices.findById(id);
    if(blog.status !== "Success") {
        return res.sendStatus(resultCodeToHttpException(blog.status));
    }

    await blogsServices.delete(id);
     res.sendStatus(resultCodeToHttpException(ResultStatus.NoContent));
}