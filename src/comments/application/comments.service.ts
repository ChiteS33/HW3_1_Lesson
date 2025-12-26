import {CommentInPut} from "../types/commentInPut";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {PostsService} from "../../posts/application/posts.service";
import {CommentsRepository} from "../repositories/comments.repository";
import {inject, injectable} from "inversify";
import {CommentDocument, CommentModel, LikeDislikeStatus, LikeDocument, LikeModel} from "../routers/comments.entity";
import {PostDocument} from "../../posts/routes/posts.entity";
import "reflect-metadata"
import {UsersService} from "../../users/application/users.service";



@injectable()
export class CommentsService {


    constructor(@inject(PostsService) public postsService: PostsService,
                @inject(CommentsRepository) public commentsRepository: CommentsRepository,
                @inject(UsersService) public usersService: UsersService,) {
    }


    async findCommentById(commentId: string): Promise<ObjectResult<CommentDocument | null>> {
        const foundComment: CommentDocument | null = await this.commentsRepository.findById(commentId);
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Comment not found",
                extensions: [{
                    field: "commentId",
                    message: "Comment not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundComment
        }
    }

    async createComment(userLogin: string, userId: string, body: CommentInPut, postId: string): Promise<ObjectResult<string | null>> {
        const foundPost: ObjectResult<PostDocument | null> = await this.postsService.findById(postId);
        if (!foundPost.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post is not found",
                extensions: [{
                    field: "Post",
                    message: "Post is not found"
                }],
                data: null
            }
        }
        const newComment = new CommentModel()
        newComment.content = body.content
        newComment.postId = postId;
        newComment.commentatorInfo.userId = userId;
        newComment.commentatorInfo.userLogin = userLogin;
        newComment.createdAt = new Date();
        const createdCommentId = await this.commentsRepository.save(newComment);
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdCommentId
        }
    }

    async updateComment(id: string, body: CommentInPut, userLogin: string): Promise<ObjectResult<null>> {
        const foundComment: ObjectResult<CommentDocument | null> = await this.findCommentById(id)
        if (foundComment.status === "NotFound") {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Comment not found",
                extensions: [{
                    field: "CommentId",
                    message: "Comment not found"
                }],
                data: null
            }
        }
        if (userLogin !== foundComment.data!.commentatorInfo.userLogin)
            return {
                status: ResultStatus.Forbidden,
                errorMessage: "user is not correct",
                extensions: [{
                    field: "userLogin",
                    message: "user is not correct"
                }],
                data: null
            }
        const updatedComment = new CommentModel(foundComment)
        updatedComment.content = body.content;
        await this.commentsRepository.save(updatedComment)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async deleteComment(id: string, userLogin: string): Promise<ObjectResult<void | null>> {
        const foundComment: ObjectResult<CommentDocument | null> = await this.findCommentById(id);
        if (foundComment.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Comment not found",
                extensions: [{
                    field: "commentId",
                    message: "Comment not found"
                }],
                data: null
            }
        }
        if (userLogin !== foundComment.data!.commentatorInfo.userLogin) {
            return {
                status: ResultStatus.Forbidden,
                errorMessage: "Login is Forbidden",
                extensions: [{
                    field: "LoginId",
                    message: "Login is Forbidden"
                }],
                data: null
            }
        }
        await this.commentsRepository.delete(id);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async setLikeStatus(commentId: string, userId: string, likeStatus: LikeDislikeStatus): Promise<ObjectResult<null>> {
        const foundComment = await this.findCommentById(commentId);
        if (foundComment.status !== "Success") {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Comment not found",
                extensions: [{
                    field: "commentId",
                    message: "Comment not found"
                }],
                data: null
            }
        }
        const foundLike = await this.findLikeByUserIdAndCommentId(userId, commentId)
        if (foundLike.status !== "Success") {
            const newLike = new LikeModel()
            newLike.userId = userId
            newLike.commentId = commentId
            newLike.status = likeStatus
            await this.commentsRepository.saveLikeStatus(newLike)
            return {
                status: ResultStatus.NoContent,
                extensions: [],
                data: null
            }
        }
        foundLike.data!.status = likeStatus
        await this.commentsRepository.saveLikeStatus(foundLike.data)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async findLikeByUserIdAndCommentId(userId: string, commentId: string): Promise<ObjectResult<LikeDocument | null>> {
        const foundLike: LikeDocument | null = await this.commentsRepository.findLikeByCommentId(commentId, userId)
        if (!foundLike) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Like not found",
                extensions: [{
                    field: "Like",
                    message: "Like not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundLike
        }
    }

}
