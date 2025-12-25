import {outPutPostMapper} from "../routes/mappers/outPutPostMapper";
import {outPutPaginationPostMapper} from "../routes/mappers/postFinalMapper";
import {PostOutPut} from "../types/postOutPut";
import {PaginationForRepo} from "../../common/types/paginationForRepo";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {InPutPagination} from "../../common/types/inPutPagination";
import {valuesPaginationMaker} from "../../common/mapper/valuesPaginationMaker";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"
import {injectable} from "inversify";


@injectable()
export class PostsQueryRepository {


    async findAll(query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const preFinishValues: PostDocument[] = await PostModel.find().skip(skip).limit(limit).sort(sort)
        const totalCount = await PostModel.countDocuments()

        const addValuesForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        const postForFront: PostOutPut[] = preFinishValues.map(outPutPostMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postForFront, addValuesForFront)
        }
    }

    async findById(id: string): Promise<ObjectResult<PostOutPut | null>> {
        const post: PostDocument | null = await PostModel.findOne({_id: id})
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post not found",
                extensions: [{
                    field: "postId",
                    message: " Post not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPostMapper(post)
        }
    }

    async findPostsByBlogId(id: string, query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {
        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize;
        const sorting = {
            [pagination.sortBy]: pagination.sortDirection,
        }
        const posts: PostDocument[] = await PostModel.find({blogId: id}).skip(skip).limit(limit).sort(sorting);
        const totalCount = await PostModel.countDocuments({blogId: id})
        const addValuesForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        const postsForFront: PostOutPut[] = posts.map(outPutPostMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postsForFront, addValuesForFront)
        }
    }


}

