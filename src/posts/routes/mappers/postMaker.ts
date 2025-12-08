
import {PostInDb} from "../../types/postInDb";
import {WithId} from "mongodb";

import {PostOutPutDto} from "../../types/postInPutDto";
import {BlogInDb} from "../../../blogs/types/blogInDb";

export const postMaker = (blog: WithId<BlogInDb>, body: PostOutPutDto): PostInDb => {
    return {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: blog._id,
        blogName: blog.name,
        createdAt: new Date().toISOString()
    }
}