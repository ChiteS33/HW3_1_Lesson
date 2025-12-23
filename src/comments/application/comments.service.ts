import {CommentInPut} from "../types/commentInPut";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {PostsService} from "../../posts/application/posts.service";
import {CommentsRepository} from "../repositories/comments.repository";
import {inject} from "inversify";
import {CommentDocument, CommentModel} from "../routers/comments.entity";
import {PostDocument} from "../../posts/routes/posts.entity";
import {ObjectId} from "mongodb";


export class CommentsService {


    constructor(@inject(PostsService) public postsService: PostsService,
                @inject(CommentsRepository) public commentsRepository: CommentsRepository,) {
    }


    async findCommentById(id: string): Promise<ObjectResult<CommentDocument | null>> {
        const result: CommentDocument | null = await this.commentsRepository.findById(id);
        if (!result) {
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
            data: result
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
        newComment.postId = new ObjectId(postId);
        newComment.commentatorInfo.userId = new ObjectId(userId);
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
        if (!foundComment.data) {
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


}
