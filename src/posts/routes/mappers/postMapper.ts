import {PostInDb} from "../../types/postInDb";
import {PostOutPut} from "../../types/postOutPut";
import {WithId} from "mongodb";

export const postMapper = (post: WithId<PostInDb> ):PostOutPut => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}