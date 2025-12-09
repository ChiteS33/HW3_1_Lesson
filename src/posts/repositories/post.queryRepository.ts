import {PostInDb} from "../types/postInDb";
import {postCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../routes/mappers/postMapper";
import {finalPostMapper} from "../routes/mappers/postFinalMapper";
import {PostOutPut} from "../types/postOutPut";
import {PaginationForRepo} from "../../common/types/paginationForRepo";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {InPutPagination} from "../../common/types/inPutPagination";
import {valuesPaginationMaker} from "../../common/mapper/valuesPaginationMaker";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";


export const postQueryRepository = {

    async findAll(query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}

        const preFinishValues: WithId<PostInDb>[] = await postCollection.find().skip(skip).limit(limit).sort(sort).toArray()
        const totalCount = await postCollection.countDocuments()

        const addValuesForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const postForFront: PostOutPut[] = preFinishValues.map(postMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalPostMapper(postForFront, addValuesForFront)

        }

    },
    async findById(id: string): Promise<ObjectResult<PostOutPut | null>> {
        const post: WithId<PostInDb> | null = await postCollection.findOne({_id: new ObjectId(id)})
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
            data: postMapper(post)
        }


    },

    async findPostsByBlogId(id: string, query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize;
        const sorting = {
            [pagination.sortBy]: pagination.sortDirection,
        }
        const posts = await postCollection.find({blogId: new ObjectId(id)}).skip(skip).limit(limit).sort(sorting).toArray();
        const totalCount = await postCollection.countDocuments({blogId: new ObjectId(id)})

        const addValuesForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const postsForFront: PostOutPut[] = posts.map(postMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalPostMapper(postsForFront, addValuesForFront)
        }

    }

}

