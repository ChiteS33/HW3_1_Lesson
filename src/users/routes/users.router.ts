import {container} from "../../composition-root";
import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {paginationValidationWithEmailAndLogin} from "../../common/validation/paginationWithLoginAndEmail";
import {userInputDtoValidation} from "../validation/userInputValidation";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {UsersController} from "../application/users.controller";



export const usersRouter = Router({})
const usersController = container.get<UsersController>(UsersController);


usersRouter
    .get('',superAdminGuardMiddleware, paginationValidationWithEmailAndLogin, inputValidationResultMiddleware, usersController.getUserList.bind(usersController))
    .post('',superAdminGuardMiddleware, userInputDtoValidation, inputValidationResultMiddleware, usersController.createUser.bind(usersController))
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware,  usersController.deleteUser.bind(usersController))






