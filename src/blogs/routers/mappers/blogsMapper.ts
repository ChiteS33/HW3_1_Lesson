import {BlogOutPut} from "../../types/blogOutPut";
import {BlogInDb} from "../../types/blogInDb";
import {WithId} from "mongodb";

export const blogMapper = (blog: WithId<BlogInDb>): BlogOutPut => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}