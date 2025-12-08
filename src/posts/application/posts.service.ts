import {postRepository} from "../repositories/post.repository";
import {PostInDb} from "../types/postInDb";
import {WithId} from "mongodb";
import {PostInputDto} from "../types/post-input.dto";
import {BlogInDb} from "../../blogs/types/blogInDb";
import {PostInputDtoForBlog} from "../types/postInBlog";
import {postMaker} from "../routes/mappers/postMaker";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";


export const postsServices = {


    async create(body: PostInputDto, blog: WithId<BlogInDb>): Promise<string> {

        const newPost: PostInDb = postMaker(blog, body)

        return await postRepository.create(newPost);
    },
    async update(id: string, body: PostInputDto): Promise<string> {

        return await postRepository.update(id, body);
    },
    async delete(id: string): Promise<void> {
        return await postRepository.delete(id);
    },
    async createPostByBlogId(blogId: string, inputInfo: PostInputDtoForBlog,): Promise<ObjectResult<string | null>> {

        const blog = await blogsRepository.findById(blogId);
        if (!blog) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Blog is not found",
                extensions: [{
                    field: "blogId",
                    message: "Blog is not found",
                }],
                data: null
            }
        }

        const postForRepo: PostInDb = postMaker(blog, inputInfo);
        const post = await postRepository.create(postForRepo)

        return {
            status: ResultStatus.Created,
            extensions: [],
            data: post
        }


    }


}
