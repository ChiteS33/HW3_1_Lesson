import {commentsRepository} from "../repositories/comments.repository";
import {CommentInPut} from "../types/commentInPut";
import {UserInDb} from "../../users/types/userInDb";
import {WithId} from "mongodb";
import {commentsValueMaker} from "../routers/mappers/commentsMapperForRepo";
import {CommentInDb} from "../types/commentInDb";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {postsServices} from "../../posts/application/posts.service";


export const commentsServices = {

    async findById(id: string): Promise<ObjectResult<WithId<CommentInDb> | null>> {
        const result = await commentsRepository.findById(id);
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
    },
    async create(user: WithId<UserInDb>, body: CommentInPut, postId: string): Promise<ObjectResult<string | null>> {
        const post = await postsServices.findById(postId);

        if (!post.data) {
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

        const newComment: CommentInDb = commentsValueMaker(postId, body, user)
        const createdCommentId = await commentsRepository.create(newComment)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdCommentId
        }

    },
    async update(id: string, body: CommentInPut, userLogin: string): Promise<ObjectResult<null>> {
        const foundComment = await commentsServices.findById(id)
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

        await commentsRepository.update(id, body);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    },
    async delete(id: string, userLogin: string): Promise<ObjectResult<void | null>> {
        const check: ObjectResult<WithId<CommentInDb> | null> = await commentsServices.findById(id);

        if (check.status !== ResultStatus.Success) {
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
        if (userLogin !== check.data!.commentatorInfo.userLogin) {
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

        await commentsRepository.delete(id);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}
