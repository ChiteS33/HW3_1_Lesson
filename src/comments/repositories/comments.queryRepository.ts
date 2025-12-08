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


export const commentsQueryRepository = {

    async findById(id: string): Promise<CommentOutPut | null> {

        const foundComment: WithId<CommentInDb> | null = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!foundComment) return null;

        return commentMapp(foundComment)

    },

    async findByPostId(postId: string, query: InPutPagination): Promise<FinalWithPagination<CommentOutPut>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const limit = pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const search = {postId: new ObjectId(postId)}


        const comments: WithId<CommentInDb>[] = await commentCollection.find(search).skip(skip).limit(limit).sort(sort).toArray();
        const totalCount = await commentCollection.countDocuments(search)

        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / limit),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const commentsForFront: CommentOutPut[] = comments.map(commentMapp)
        return finalCommentsMapperWithPago(commentsForFront, params)

    }

}