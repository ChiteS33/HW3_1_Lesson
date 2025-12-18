import {BlogInputDto} from "../types/blogInPutDto";
import {blogsValueMaker} from "../routers/mappers/blogsMapperForRepo";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogInDb} from "../types/blogInDb";
import {WithId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs.repository";



export class BlogsService {

    blogsRepository: BlogsRepository;

    constructor(blogsRepository: BlogsRepository) {
        this.blogsRepository = blogsRepository;
    }

    async findById(id: string): Promise<ObjectResult<WithId<BlogInDb> | null>> {
        const foundBlog = await this.blogsRepository.findById(id);
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
        const newBlog = blogsValueMaker(inputInfo);
        const createdBlogId = await this.blogsRepository.create(newBlog);
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdBlogId
        }
    }

    async update(id: string, inputInfo: BlogInputDto): Promise<ObjectResult<void | null>> {
        await this.blogsRepository.update(id, inputInfo);
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

