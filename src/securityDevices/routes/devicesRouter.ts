import {Router} from "express";
import {getAllDevices} from "./handlers/get-listDevicesWithActiveSessions.handler";

import {refreshTokenMiddleware} from "../../auth/middlewares/refreshToken.middleware";
import {idValidation} from "../../core/middlewares/validation/params-id.validation-middleware";
import {deleteByDeviceId} from "./handlers/delete-deleteByDeviceId.handler";
import {deleteAllExcludeCurrent} from "./handlers/delete- deleteAllExcludeCurrent.handler";



export const devicesRouter = Router({});


devicesRouter
.get('', refreshTokenMiddleware, getAllDevices)
.delete('', refreshTokenMiddleware, deleteAllExcludeCurrent)
.delete('/:id', refreshTokenMiddleware, idValidation, deleteByDeviceId)