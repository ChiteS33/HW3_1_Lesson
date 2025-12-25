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
import {CommentDocument, CommentModel, LikeDocument, LikeModel} from "../routers/comments.entity";
import "reflect-metadata"
import {commentsFinalMapperWithCount} from "../routers/mappers/commentsFinalMapperWithCount";


@injectable()
export class CommentsQueryRepository {

    constructor(@inject(PostsService) public postsService: PostsService) {

    }


    async findByCommentId(commentId: string, user: any): Promise<ObjectResult<CommentOutPut | null>> {
        const totalCountLike = await LikeModel.countDocuments({commentId: commentId, status: "Like"})
        const totalCountDislike = await LikeModel.countDocuments({commentId: commentId, status: "Dislike"})
        let myStatus = "None"
        const foundComment: CommentDocument | null = await CommentModel.findOne({_id: commentId})
        if (!foundComment) return {
            status: ResultStatus.NotFound,
            errorMessage: "Could not find comment",
            extensions: [{
                field: "commentId",
                message: "Could not find comment",
            }],
            data: null
        };
        if (user === null) {
            return {
                status: ResultStatus.Success,
                extensions: [],
                data: commentsFinalMapperWithCount(foundComment, {totalCountLike, totalCountDislike, myStatus})
            }
        }
        const userId = user._id.toString()
        const foundLikeForComment: LikeDocument | null = await LikeModel.findOne({commentId, userId});
                if (!foundLikeForComment) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Like not found",
                extensions: [{
                    field: "commentId",
                    message: "Like not found"
                }],
                data: null
            }
        }
        const foundLikeStatus = foundLikeForComment.status;
        if (userId !== foundLikeForComment.userId) {
            return {
                status: ResultStatus.Success,
                extensions: [],
                data: commentsFinalMapperWithCount(foundComment, {totalCountLike, totalCountDislike, myStatus}),
            }
        }
        myStatus = foundLikeStatus
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: commentsFinalMapperWithCount(foundComment, {totalCountLike, totalCountDislike, myStatus}),
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
        const search = {postId: postId}
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