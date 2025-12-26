import {BlogInputDto} from "../types/blogInPutDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogsRepository} from "../repositories/blogs.repository";
import {inject, injectable} from "inversify";
import {BlogDocument, BlogModel} from "../routers/blogs.entity";
import "reflect-metadata"


@injectable()
export class BlogsService {


    constructor(@inject(BlogsRepository) public blogsRepository: BlogsRepository) {
    }

    async findById(id: string): Promise<ObjectResult<BlogDocument | null>> {
        const foundBlog: BlogDocument | null = await this.blogsRepository.findById(id);
        if (!foundBlog) return {
            status: ResultStatus.NotFound,
            errorMessage: " blogId is not founded",
            extensions: [{
                field: "blogId",
                message: " blogId is not founded"
            }],
            data: null
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundBlog
        }
    }

    async createBlog(inputInfo: BlogInputDto): Promise<ObjectResult<string>> {
        const newBlog = new BlogModel()
        newBlog.name = inputInfo.name
        newBlog.description = inputInfo.description
        newBlog.websiteUrl = inputInfo.websiteUrl
        newBlog.createdAt = new Date()
        newBlog.isMembership = false
        const createdBlogId = await this.blogsRepository.save(newBlog);
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdBlogId
        }
    }

    async update(id: string, inputInfo: BlogInputDto): Promise<ObjectResult<null>> {
        const foundBlog: BlogDocument | null = await this.blogsRepository.findById(id);
        if (!foundBlog) {
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
        foundBlog.name = inputInfo.name
        foundBlog.description = inputInfo.description
        foundBlog.websiteUrl = inputInfo.websiteUrl
        await this.blogsRepository.save(foundBlog);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async delete(id: string): Promise<ObjectResult<void | null>> {
        await this.blogsRepository.delete(id);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}

