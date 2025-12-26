import {PostInputDto} from "../types/post-input.dto";
import {PostInputDtoForBlog} from "../types/postInBlog";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {WithId} from "mongodb";
import {BlogsService} from "../../blogs/application/blogs.service";
import {PostsRepository} from "../repositories/postsRepository";
import {inject, injectable} from "inversify";
import {PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"


@injectable()
export class PostsService {

    constructor(@inject(BlogsService) public blogsService: BlogsService,
                @inject(PostsRepository) public postsRepository: PostsRepository) {
    }


    async findById(id: string): Promise<ObjectResult<WithId<PostDocument> | null>> {
        const result: PostDocument | null = await this.postsRepository.findById(id);
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
        const newPost = new PostModel()
        newPost.title = body.title
        newPost.shortDescription = body.shortDescription
        newPost.content = body.content
        newPost.blogId = blog.data._id.toString()
        newPost.blogName = blog.data.name
        newPost.createdAt = new Date()

        const newPostId = await this.postsRepository.save(newPost)
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
        const updatedPost = new PostModel(post)
        updatedPost.title = body.title
        updatedPost.shortDescription = body.shortDescription
        updatedPost.content = body.content
        updatedPost.blogId = blog.data._id.toString()
        const updatedPostId = await this.postsRepository.save(updatedPost)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: updatedPostId
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
        const newPost = new PostModel()
        newPost.title = inputInfo.title
        newPost.shortDescription = inputInfo.shortDescription
        newPost.content = inputInfo.content
        newPost.blogId = blog.data._id.toString()
        newPost.blogName = blog.data.name
        newPost.createdAt = new Date()

        const newPostId = await this.postsRepository.save(newPost)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: newPostId
        }
    }

}
