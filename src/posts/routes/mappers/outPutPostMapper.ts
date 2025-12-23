import {PostOutPut} from "../../types/postOutPut";

import {PostDocument} from "../posts.entity";

export const outPutPostMapper = (post: PostDocument ):PostOutPut => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt.toString()
    }
}