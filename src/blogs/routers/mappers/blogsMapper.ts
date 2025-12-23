import {BlogOutPut} from "../../types/blogOutPut";
import {BlogDocument} from "../blogs.entity";

export const outPutBlogMapper = (blog: BlogDocument): BlogOutPut => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
    }
}