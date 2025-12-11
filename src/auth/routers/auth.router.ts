import {Router} from "express";
import {tryLoginUserHandler} from "./handlers/post-auth.handler";
import {loginOrEmailValidation} from "../../common/validation/paginationLoginAndPass";
import {getInfoAboutUserHandler} from "./handlers/get-infoAboutUser.handler";
import {authorizationMiddleware} from "../middlewares/authorization.middleware";
import {registrationInSystemHandler} from "./handlers/post-registration.handler";
import {confirmEmailHandler} from "./handlers/post-confirmEmail.handler";
import {resendEmailHandler} from "./handlers/post-resendEmail.handler";
import {userInputDtoValidation} from "../../users/validation/userInputValidation";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {codeInPutValidation} from "../validation/codeValidation";
import {authEmailValidation} from "../validation/emailInPutValidation";
import {refreshTokenHandler} from "./handlers/post-refreshToken.handler";
import {logoutHandler} from "./handlers/post-logout.handler";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";



export const authRouter = Router({});

authRouter
    .post('/login', loginOrEmailValidation, inputValidationResultMiddleware, tryLoginUserHandler)
    .post('/refresh-token', refreshTokenMiddleware, refreshTokenHandler)
    .post('/registration-confirmation', codeInPutValidation, inputValidationResultMiddleware, confirmEmailHandler)
    .post('/registration',userInputDtoValidation, inputValidationResultMiddleware, registrationInSystemHandler)
    .post('/registration-email-resending', authEmailValidation, inputValidationResultMiddleware, resendEmailHandler)
    .post('/logout', refreshTokenMiddleware, logoutHandler)
    .get('/me', authorizationMiddleware, inputValidationResultMiddleware, getInfoAboutUserHandler)


