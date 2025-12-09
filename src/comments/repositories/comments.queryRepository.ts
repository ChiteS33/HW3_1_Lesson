import {ObjectId, WithId} from "mongodb";
import {commentCollection} from "../../db/mongo.db";
import {CommentInDb} from "../types/commentInDb";
import {commentMapp} from "../routers/mappers/commentsFinalMapper";
import {CommentOutPut} from "../types/commentOutPut";
import {valuesPaginationMaker} from "../../common/mapper/valuesPaginationMaker";
import {PaginationForRepo} from "../../common/types/paginationForRepo";
import {OutPutPagination} from "../../common/types/outputPagination";
import {finalCommentsMapperWithPago} from "../routers/mappers/commentsFinalMapperWithPago";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {InPutPagination} from "../../common/types/inPutPagination";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {postsServices} from "../../posts/application/posts.service";


export const commentsQueryRepository = {

    async findById(id: string): Promise<ObjectResult<CommentOutPut | null>> {

        const foundComment: WithId<CommentInDb> | null = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!foundComment) return {
            status: ResultStatus.NotFound,
            errorMessage: "Could not find comment",
            extensions: [{
                field: "commentId",
                message: "Could not find comment",
            }],
            data: null
        };

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: commentMapp(foundComment)
        }


    },

    async findByPostId(postId: string, query: InPutPagination): Promise<ObjectResult<FinalWithPagination<CommentOutPut> | null>> {

        const result = await postsServices.findById(postId);
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

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const limit = pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const search = {postId: new ObjectId(postId)}


        const comments: WithId<CommentInDb>[] = await commentCollection.find(search).skip(skip).limit(limit).sort(sort).toArray();
        if(!comments){
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Comments is not found",
                extensions: [{
                    field: "Comments",
                    message: "Comments is not found"
                }],
                data: null
            }
        }
        const totalCount = await commentCollection.countDocuments(search)

        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / limit),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const commentsForFront: CommentOutPut[] = comments.map(commentMapp)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalCommentsMapperWithPago(commentsForFront, params)
        }

    }

}