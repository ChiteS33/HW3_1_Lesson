import {PaginationForRepoWithSearchName} from "../../common/types/paginationForRepoWithSearchName";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {BlogOutPut} from "../types/blogOutPut";
import {ObjectId} from "mongodb";
import {OutPutPagination} from "../../common/types/outputPagination";
import {outPutBlogMapper} from "../routers/mappers/blogsMapper";
import {outPutPaginationMapper} from "../routers/mappers/blogsFinalMapper";
import {outPutPaginationWithSearchMapper} from "../routers/mappers/blogsPaginationMapperWithSearch";
import {InPutPagination} from "../../common/types/inPutPagination";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {BlogDocument, BlogModel} from "../routers/blogs.entity";


export class BlogsQueryRepository {


     async findAll(query: InPutPagination): Promise<ObjectResult<FinalWithPagination<BlogOutPut>>> {
        const pagination: PaginationForRepoWithSearchName = outPutPaginationWithSearchMapper(query)
        const limit = pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize;
        const search =
            pagination.searchNameTerm ? {
                name: {
                    $regex: pagination.searchNameTerm,
                    $options: "i",
                }
            } : {}
        const blogs: BlogDocument[] = await BlogModel.find(search).skip(skip).limit(limit).sort(sort);
        const totalCount = await BlogModel.countDocuments(search);
        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / limit),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        const blogForFrontend: BlogOutPut[] = blogs.map(outPutBlogMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationMapper(blogForFrontend, params)
        }
    }

     async findById(id: string): Promise<ObjectResult<BlogOutPut | null>> {
        const foundBlog: BlogDocument | null = await BlogModel.findOne({_id: new ObjectId(id)});
        if (!foundBlog) return {
            status: ResultStatus.NotFound,
            errorMessage: "blog is not founded",
            extensions: [{
                field: "blog",
                message: "blog is not founded",
            }],
            data: null
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutBlogMapper(foundBlog)
        }
    }
}