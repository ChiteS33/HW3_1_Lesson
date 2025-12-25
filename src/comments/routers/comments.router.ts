import {Router} from "express";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {authorizationMiddleware} from "../../auth/middlewares/authorization.middleware";
import {commentInputDtoValidation} from "../validation/commentsInputValidation";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {container} from "../../composition-root";
import "reflect-metadata";
import {CommentsController} from "../application/comments.controller";
import {authorizationForCommentWitLike} from "../../auth/middlewares/authorizationForCommentWithLike.middleware";




const commentsController = container.get(CommentsController);
export const commentsRouter = Router({})


commentsRouter
    .get('/:id', authorizationForCommentWitLike, inputValidationResultMiddleware, idValidation, commentsController.getCommentById.bind(commentsController))
    .put('/:id', authorizationMiddleware, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, commentsController.updateComment.bind(commentsController))
    .delete('/:id', authorizationMiddleware, idValidation, inputValidationResultMiddleware, commentsController.deleteComment.bind(commentsController))

.put('/:id/like-status', authorizationMiddleware, inputValidationResultMiddleware, commentsController.createLikeForComment.bind(commentsController))