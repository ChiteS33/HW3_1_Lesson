import {blogsRepository} from "../repositories/blogs.repository";
import {BlogInputDto} from "../types/blogInPutDto";
import {blogsValueMaker} from "../routers/mappers/blogsMapperForRepo";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogInDb} from "../types/blogInDb";
import {WithId} from "mongodb";


export const blogsServices = {

async findById(id: string): Promise<ObjectResult<WithId<BlogInDb> | null>> {
    const foundBlog = await blogsRepository.findById(id);
    if(!foundBlog) return {
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
},

    async create(inputInfo: BlogInputDto): Promise<ObjectResult<string>> {

        const newBlog = blogsValueMaker(inputInfo);
        const createdBlogId = await blogsRepository.create(newBlog);

        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdBlogId
        }


    },
    async update(id: string, inputInfo: BlogInputDto): Promise<void | null> {
        return await blogsRepository.update(id, inputInfo);
    },
    async delete(id: string): Promise<void | null> {
        return await blogsRepository.delete(id);
    }
}

