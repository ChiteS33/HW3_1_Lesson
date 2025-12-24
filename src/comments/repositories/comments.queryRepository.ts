import {commentMapper} from "../routers/mappers/commentsFinalMapper";
import {CommentOutPut} from "../types/commentOutPut";
import {valuesPaginationMaker} from "../../common/mapper/valuesPaginationMaker";
import {PaginationForRepo} from "../../common/types/paginationForRepo";
import {OutPutPagination} from "../../common/types/outputPagination";
import {finalCommentsMapperWithPago} from "../routers/mappers/commentsFinalMapperWithPago";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {InPutPagination} from "../../common/types/inPutPagination";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {PostsService} from "../../posts/application/posts.service";
import {inject, injectable} from "inversify";
import {CommentDocument, CommentModel} from "../routers/comments.entity";
import "reflect-metadata"
import {ObjectId} from "mongodb";




@injectable()
export class CommentsQueryRepository {

    constructor(@inject(PostsService) public postsService: PostsService) {

    }


    async findById(id: string): Promise<ObjectResult<CommentOutPut | null>> {
        const foundComment: CommentDocument | null = await CommentModel.findOne({_id: id})
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
            data: commentMapper(foundComment)
        }
    }

    async findByPostId(postId: string, query: InPutPagination): Promise<ObjectResult<FinalWithPagination<CommentOutPut> | null>> {
        const result = await this.postsService.findById(postId);
        if (!result.data) {
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
        const comments: CommentDocument[] = await CommentModel.find(search).skip(skip).limit(limit).sort(sort);
        if (!comments) {
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
        const totalCount = await CommentModel.countDocuments(search)
        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / limit),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        const commentsForFront: CommentOutPut[] = comments.map(commentMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalCommentsMapperWithPago(commentsForFront, params)
        }
    }


}