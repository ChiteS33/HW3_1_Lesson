import {PostInputDto} from "../types/post-input.dto";
import {PostInputDtoForBlog} from "../types/postInBlog";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogsService} from "../../blogs/application/blogs.service";
import {PostsRepository} from "../repositories/postsRepository";
import {inject, injectable} from "inversify";
import {LikeDocumentForPost, LikeModelForPost, PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"
import {LikeDislikeStatus} from "../../comments/routers/comments.entity";


@injectable()
export class PostsService {

    constructor(@inject(BlogsService) public blogsService: BlogsService,
                @inject(PostsRepository) public postsRepository: PostsRepository) {
    }


    async findPostById(id: string): Promise<ObjectResult<PostDocument | null>> {
        const foundPost: PostDocument | null = await this.postsRepository.findById(id);
        if (!foundPost) {
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
            data: foundPost
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

    async updatePost(postId: string, body: PostInputDto): Promise<ObjectResult<string | null>> {
        const post = await this.findPostById(postId);
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

    async deletePost(postId: string): Promise<ObjectResult<null>> {
        const post = await this.findPostById(postId);
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

    async setLikeStatus(postId: string, userId: string, likeStatus: LikeDislikeStatus, userLogin: string): Promise<ObjectResult<null>> {

        const foundPost = await this.findPostById(postId);
        if (foundPost.status !== "Success") {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post not found",
                extensions: [{
                    field: "postId",
                    message: "Post not found"
                }],
                data: null
            }
        }
               const foundLike = await this.findLikeByUserIdAndPostId(userId, postId);
        if (foundLike.status !== "Success") {
            const newLike = new LikeModelForPost()
            newLike.userId = userId
            newLike.login = userLogin
            newLike.postId = postId
            newLike.status = likeStatus
            newLike.data = new Date()

            await this.postsRepository.saveLike(newLike)
            return {
                status: ResultStatus.NoContent,
                extensions: [],
                data: null
            }
        }
        foundLike.data!.status = likeStatus
        await this.postsRepository.saveLike(foundLike.data!)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }

    }

    async findLikeByUserIdAndPostId(userId: string, postId: string): Promise<ObjectResult<LikeDocumentForPost | null>> {
        const foundLike: LikeDocumentForPost | null = await this.postsRepository.findLikeByPostId(postId, userId);
        if (!foundLike) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Like not found",
                extensions: [{
                    field: "Like",
                    message: "Like not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundLike
        }

    }

}
