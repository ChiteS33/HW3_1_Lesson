import {NextFunction, Request, Response} from "express";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {WithId} from "mongodb";
import {container} from "../../composition-root";
import {Payload} from "../../common/types/payload";
import {JwtService} from "../../common/service/jwt-service";
import {SessionInDb} from "../../securityDevices/routes/sessions.entity";
import {SessionsService} from "../../securityDevices/application/sessions.service";





const jwtService = container.get(JwtService)
const sessionsService = container.get(SessionsService);
export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token not found"});
        return;
    }
    const payload: Payload = await jwtService.decodeJWT(refreshToken)
    const refreshTokenIat = new Date(payload.iat! * 1000)
    const refreshTokenExp = new Date(payload.exp! * 1000)
    const userId: string | null= await jwtService.verifyRefreshToken(refreshToken)
    if (!userId) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token expired or invalid"});
        return
    }
    const session: ObjectResult<WithId<SessionInDb> | null> = await sessionsService.findByUserIdAndDeviceId(refreshToken)
    const currentDevice = session.data
    if (!currentDevice) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send("dsadsdsDASDSADDSd");
        return;
    }
    if (currentDevice.iat.toISOString() !== refreshTokenIat.toISOString() || currentDevice.exp.toISOString() !== refreshTokenExp.toISOString()) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token expired or invalid2121212"});
        return;
    }

    next();
}