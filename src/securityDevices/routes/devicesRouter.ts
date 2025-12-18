import {Router} from "express";
import {refreshTokenMiddleware} from "../../auth/middlewares/refreshToken.middleware";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {sessionsController} from "../../composition-root";



export const devicesRouter = Router({});


devicesRouter
.get('', refreshTokenMiddleware, sessionsController.getAllDevices.bind(sessionsController))
.delete('', refreshTokenMiddleware, sessionsController.deleteAllExcludeCurrent.bind(sessionsController))
.delete('/:id', refreshTokenMiddleware, idValidation, sessionsController.deleteByDeviceId.bind(sessionsController))