import {PostInDb} from "../types/postInDb";
import {PostInputDto} from "../types/post-input.dto";
import {PostInputDtoForBlog} from "../types/postInBlog";
import {postMaker} from "../routes/mappers/postMaker";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {WithId} from "mongodb";
import {BlogsService} from "../../blogs/application/blogs.service";
import {PostsRepository} from "../repositories/postsRepository";



export class PostsService {

    blogsService: BlogsService;
    postsRepository: PostsRepository;

    constructor(blogsService: BlogsService, postsRepository: PostsRepository) {
        this.blogsService = blogsService;
        this.postsRepository = postsRepository;

    }


    async findById(id: string): Promise<ObjectResult<WithId<PostInDb> | null>> {
        const result = await this.postsRepository.findById(id);
        if (!result) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post not found",
                extensions: [{
                    field: "Post",
                    message: "Post not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: result
        }
    }

    async createPost(body: PostInputDto): Promise<ObjectResult<string | null>> {
        const blog = await this.blogsService.findById(body.blogId);
        if (!blog.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Blog is not found",
                extensions: [{
                    field: "BlogId",
                    message: "Blog is not found"
                }],
                data: null
            }
        }
        const newPostId = await this.postsRepository.create(postMaker(blog.data!, body))
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: newPostId
        }
    }

    async update(postId: string, body: PostInputDto): Promise<ObjectResult<string | null>> {
        const post = await this.findById(postId);
        if (!post.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post is not found",
                extensions: [{
                    field: "Post",
                    message: "Post is not found",
                }],
                data: null
            }
        }
        const blog = await this.blogsService.findById(body.blogId);
        if (!blog.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Blog is not found",
                extensions: [{
                    field: "Blog",
                    message: "Blog is not found",
                }],
                data: null
            }
        }
        const result = await this.postsRepository.update(postId, body);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: result
        }
    }

    async delete(postId: string): Promise<ObjectResult<null>> {
        const post = await this.findById(postId);
        if (!post.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post is not found",
                extensions: [{
                    field: "Post",
                    message: "Post is not found"
                }],
                data: null
            }
        }
        await this.postsRepository.delete(postId);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async createPostByBlogId(blogId: string, inputInfo: PostInputDtoForBlog,): Promise<ObjectResult<string | null>> {
        const blog = await this.blogsService.findById(blogId);
        if (!blog.data) {
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
        const postForRepo: PostInDb = postMaker(blog.data!, inputInfo);
        const post = await this.postsRepository.create(postForRepo)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: post
        }
    }

}
