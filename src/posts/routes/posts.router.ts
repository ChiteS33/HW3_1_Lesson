import {Router} from 'express';
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {createPostHandler} from "./handlers/create-post.handler";
import {getPostHandler} from "./handlers/get-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {postInputDtoValidationWithBlogId} from "../validation/postInputDtoValidationWithBlogId";
import {paginationValidation} from "../../common/validation/paginationValidation";
import {getCommentsByPostId} from "./handlers/get-commentByPostId.handler";
import {createCommentHandler} from "./handlers/create-comment.handler";
import {authorizationMiddleware} from "../../auth/middlewares/authorization.middleware";
import {commentInputDtoValidation} from "../../comments/validation/commentsInputValidation";



export const postsRouter = Router({});


postsRouter
    .get('/:id/comments', idValidation, paginationValidation, getCommentsByPostId)  // поиск коментов по постID
    .post('/:id/comments',authorizationMiddleware, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, createCommentHandler)  // создание нового комента
    .get('', paginationValidation, getPostListHandler)    //
    .post('', superAdminGuardMiddleware, postInputDtoValidationWithBlogId, inputValidationResultMiddleware, createPostHandler) //
    .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler) //
    .put('/:id', superAdminGuardMiddleware, idValidation, postInputDtoValidationWithBlogId, inputValidationResultMiddleware, updatePostHandler) //
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostHandler)  //