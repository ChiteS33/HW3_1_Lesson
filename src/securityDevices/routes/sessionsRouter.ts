import {Router} from "express";
import {refreshTokenMiddleware} from "../../auth/middlewares/refreshToken.middleware";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {container} from "../../composition-root";
import "reflect-metadata";
import {SessionsController} from "../application/sessions.controller";


const sessionsController = container.get(SessionsController);
export const sessionsRouter = Router({});


sessionsRouter
.get('', refreshTokenMiddleware, sessionsController.getAllDevices.bind(sessionsController))
.delete('', refreshTokenMiddleware, sessionsController.deleteAllExcludeCurrent.bind(sessionsController))
.delete('/:id', refreshTokenMiddleware, idValidation, sessionsController.deleteByDeviceId.bind(sessionsController))