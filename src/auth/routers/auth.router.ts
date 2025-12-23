import {Router} from "express";
import {loginOrEmailValidation} from "../../common/validation/paginationLoginAndPass";
import {authorizationMiddleware} from "../middlewares/authorization.middleware";
import {userInputDtoValidation} from "../../users/validation/userInputValidation";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {codeInPutValidation} from "../validation/codeValidation";
import {authEmailValidation} from "../validation/emailInPutValidation";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {checkRequestCounterMiddleware} from "../middlewares/checkRequestCounter.middleware";
import {container} from "../../composition-root";
import {emailValidationForRecovery} from "../middlewares/authCheckEmail";
import {passAndCodeValidation} from "../middlewares/authInputValidationPassAndResCode";
import {AuthController} from "../application/auth.controller";
import "reflect-metadata";


const authController = container.get(AuthController);
export const authRouter = Router({});

authRouter
    .post('/login', checkRequestCounterMiddleware, loginOrEmailValidation, inputValidationResultMiddleware, authController.tryLoginInUser.bind(authController))
    .post('/refresh-token', checkRequestCounterMiddleware, refreshTokenMiddleware, authController.refreshPairToken.bind(authController))
    .post('/registration-confirmation', checkRequestCounterMiddleware, codeInPutValidation, inputValidationResultMiddleware, authController.confirmEmail.bind(authController))
    .post('/registration', checkRequestCounterMiddleware, userInputDtoValidation, inputValidationResultMiddleware, authController.registrationInSystem.bind(authController))
    .post('/registration-email-resending', checkRequestCounterMiddleware, authEmailValidation, inputValidationResultMiddleware, authController.resendEmail.bind(authController))
    .post('/logout', refreshTokenMiddleware, authController.logout.bind(authController))
    .get('/me', authorizationMiddleware, inputValidationResultMiddleware, authController.getInfoAboutUser.bind(authController))

    .post('/password-recovery', checkRequestCounterMiddleware, emailValidationForRecovery, inputValidationResultMiddleware, authController.passRecovery.bind(authController))
    .post('/new-password', checkRequestCounterMiddleware, passAndCodeValidation, inputValidationResultMiddleware, authController.confirmPassRecovery.bind(authController))
