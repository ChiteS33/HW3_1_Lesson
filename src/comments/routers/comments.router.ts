import {Router} from "express";
import {getCommentById} from "./handler/get-comments.handler";
import {deleteComment} from "./handler/delete-comments.handler";
import {updateComment} from "./handler/update-comment.handler";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {authorizationMiddleware} from "../../auth/middlewares/authorization.middleware";
import {commentInputDtoValidation} from "../validation/commentsInputValidation";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";


export const commentsRouter = Router({})


commentsRouter
    .get('/:id', idValidation, getCommentById)            //
    .put('/:id', authorizationMiddleware, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, updateComment) //
    .delete('/:id', authorizationMiddleware, idValidation, inputValidationResultMiddleware,  deleteComment)                        //
