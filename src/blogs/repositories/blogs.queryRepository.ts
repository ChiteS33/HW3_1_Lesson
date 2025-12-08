import {PaginationForRepoWithSearchName} from "../../common/types/paginationForRepoWithSearchName";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {BlogOutPut} from "../types/blogOutPut";
import {ObjectId, WithId} from "mongodb";
import {BlogInDb} from "../types/blogInDb";
import {blogCollection} from "../../db/mongo.db";
import {OutPutPagination} from "../../common/types/outputPagination";
import {blogMapper} from "../routers/mappers/blogsMapper";
import {finalBlogMapper} from "../routers/mappers/blogsFinalMapper";
import {valuesMakerWithSearch} from "../routers/mappers/blogsPaginationMapperWithSearch";
import {InPutPagination} from "../../common/types/inPutPagination";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";


export const blogsQueryRepository = {

    async findAll(query: InPutPagination): Promise<ObjectResult<FinalWithPagination<BlogOutPut>>> {

        const pagination: PaginationForRepoWithSearchName = valuesMakerWithSearch(query)

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

        const blogs: WithId<BlogInDb>[] = await blogCollection.find(search).skip(skip).limit(limit).sort(sort).toArray();
        const totalCount = await blogCollection.countDocuments(search);

        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / limit),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const blogForFrontend: BlogOutPut[] = blogs.map(blogMapper)

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalBlogMapper(blogForFrontend, params)
        }





    },
    async findById(id: string): Promise<ObjectResult<BlogOutPut | null>> {

        const foundBlog: WithId<BlogInDb> | null = await blogCollection.findOne({_id: new ObjectId(id)});
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
            status: ResultStatus.Created,
            extensions: [],
            data: blogMapper(foundBlog)
        }

    },

}