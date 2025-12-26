import "reflect-metadata";
import {Router} from 'express';
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {postInputDtoValidationWithBlogId} from "../validation/postInputDtoValidationWithBlogId";
import {paginationValidation} from "../../common/validation/paginationValidation";
import {authorizationMiddleware} from "../../auth/middlewares/authorization.middleware";
import {commentInputDtoValidation} from "../../comments/validation/commentsInputValidation";
import {container} from "../../composition-root";
import {PostsController} from "../application/posts.controller";
import {authorizationForCommentWitLike} from "../../auth/middlewares/authorizationForCommentWithLike.middleware";




const postsController = container.get(PostsController);
export const postsRouter = Router({});


postsRouter
    .get('/:id/comments', authorizationForCommentWitLike, inputValidationResultMiddleware, idValidation, paginationValidation, postsController.getCommentsByPostId.bind(postsController))
    .post('/:id/comments',authorizationMiddleware, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, postsController.createComment.bind(postsController))
    .get('', paginationValidation, postsController.getPostList.bind(postsController))
    .post('', superAdminGuardMiddleware, postInputDtoValidationWithBlogId, inputValidationResultMiddleware, postsController.createPost.bind(postsController))
    .get('/:id', idValidation, inputValidationResultMiddleware, postsController.getPost.bind(postsController))
    .put('/:id', superAdminGuardMiddleware, idValidation, postInputDtoValidationWithBlogId, inputValidationResultMiddleware, postsController.updatePost.bind(postsController))
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, postsController.deletePost.bind(postsController))