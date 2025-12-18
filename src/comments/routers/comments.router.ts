import {Router} from "express";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {authorizationMiddleware} from "../../auth/middlewares/authorization.middleware";
import {commentInputDtoValidation} from "../validation/commentsInputValidation";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {commentsController} from "../../composition-root";


export const commentsRouter = Router({})


commentsRouter
    .get('/:id', idValidation, commentsController.getCommentById.bind(commentsController))
    .put('/:id', authorizationMiddleware, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, commentsController.updateComment.bind(commentsController))
    .delete('/:id', authorizationMiddleware, idValidation, inputValidationResultMiddleware, commentsController.deleteComment.bind(commentsController));
