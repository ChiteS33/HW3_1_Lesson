import {Request, Response} from "express";
import {BlogInputDto} from "../types/blogInPutDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogOutPut} from "../types/blogOutPut";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {PostOutPut} from "../../posts/types/postOutPut";
import {InPutPaginationWithSearchName} from "../../common/types/inPutPaginationWithSearchName";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {BlogsService} from "./blogs.service";
import {BlogsQueryRepository} from "../repositories/blogs.queryRepository";
import {PostsService} from "../../posts/application/posts.service";
import {PostsQueryRepository} from "../../posts/repositories/postsQueryRepository";
import {inject} from "inversify";
import {BlogDocument} from "../routers/blogs.entity";


export class BlogsController {


    constructor(@inject(BlogsService) public blogsService: BlogsService,
                @inject(BlogsQueryRepository) public blogsQueryRepository: BlogsQueryRepository,
                @inject(PostsService) public postsService: PostsService,
                @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository) {
    }


    async createBlog(req: Request, res: Response) {
        const createBlogData: BlogInputDto = req.body
        const createdBlog: ObjectResult<string> = await this.blogsService.createBlog(createBlogData);
        const foundBlog: ObjectResult<BlogOutPut | null> = await this.blogsQueryRepository.findById(createdBlog.data);
        if (foundBlog.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException((ResultStatus.InternalServerError)))
        }
        return res.status(resultCodeToHttpException(ResultStatus.Created)).send(foundBlog.data);
    }

    async createPostByBlogId(req: Request, res: Response,) {
        const blogId = req.params.id;
        const body = req.body;
        const createResult: ObjectResult<string | null> = await this.postsService.createPostByBlogId(blogId, body)
        if (createResult.status !== "Created") {
            return res.sendStatus(resultCodeToHttpException(createResult.status));
        }
        const createdPost: ObjectResult<PostOutPut | null> = await this.postsQueryRepository.findById(createResult.data!)
        if (createdPost.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(createResult.status));
        }
        return res.status(resultCodeToHttpException(ResultStatus.Created)).send(createdPost.data)
    }

    async deleteBlog(req: Request, res: Response) {
        const id = req.params.id;
        const blog = await this.blogsService.findById(id);
        if (blog.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(blog.status));
        }
        await this.blogsService.delete(id);
        return res.sendStatus(resultCodeToHttpException(ResultStatus.NoContent));
    }

    async getBlogById(req: Request, res: Response) {
        const blogId = req.params.id;
        const blog = await this.blogsQueryRepository.findById(blogId);
        if (blog.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(blog.status))
        }
        return res.status(resultCodeToHttpException(blog.status)).send(blog.data);
    }

    async getBlogList(req: Request, res: Response) {
        const query: InPutPaginationWithSearchName = req.query;
        const blogs: ObjectResult<FinalWithPagination<BlogOutPut>> = await this.blogsQueryRepository.findAll(query);
        return res.status(resultCodeToHttpException(blogs.status)).send(blogs.data);
    }

    async getPostByBlogId(req: Request, res: Response,) {
        const blogId = req.params.id;
        const query = req.query;
        const foundBlog = await this.blogsService.findById(blogId)
        if (foundBlog.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(foundBlog.status))
        }
        const post: ObjectResult<FinalWithPagination<PostOutPut>> = await this.postsQueryRepository.findPostsByBlogId(blogId, query) //
        return res.status(resultCodeToHttpException(post.status)).send(post.data);
    }

    async updateBlog(req: Request, res: Response) {
        const id = req.params.id;
        const body = req.body;
        const blog: ObjectResult<BlogDocument | null> = await this.blogsService.update(id, body);
        if (blog.status !== "NoContent") {
            return res.sendStatus(resultCodeToHttpException(blog.status))
        }
        return res.sendStatus(resultCodeToHttpException(blog.status));
    }
}