import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {createUserHandler} from "./handlers/create-user.handler";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {paginationValidationWithEmailAndLogin} from "../../common/validation/paginationWithLoginAndEmail";
import {userInputDtoValidation} from "../validation/userInputValidation";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {getUserListHandler} from "./handlers/get-user-list.handler";



export const usersRouter = Router({})


usersRouter
    .get('',superAdminGuardMiddleware, paginationValidationWithEmailAndLogin, inputValidationResultMiddleware, getUserListHandler)  //
    .post('',superAdminGuardMiddleware, userInputDtoValidation, inputValidationResultMiddleware, createUserHandler)
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteUserHandler)     //

