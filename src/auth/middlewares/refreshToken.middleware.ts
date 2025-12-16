import {NextFunction, Request, Response} from "express";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {jwtService} from "../../common/service/jwt-service";
import {jwtDecode} from "jwt-decode";
import {devicesServices} from "../../securityDevices/application/securityDevices.service";
import {WithId} from "mongodb";
import {DeviceInDb} from "../../securityDevices/types/deviceInDb";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken as string;


    if (!refreshToken) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token not found"});
        return;
    }

    const payload = jwtDecode(refreshToken)
    const refreshTokenIat = new Date(payload.iat! * 1000)
    const refreshTokenExp = new Date(payload.exp! * 1000)
    const userId: string = await jwtService.verifyRefreshToken(refreshToken)
    if (!userId) {
        res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token expired or invalid"});
        return
    }

    const session: ObjectResult<WithId<DeviceInDb> | null> = await devicesServices.findByUserIdAndDeviceId(refreshToken)
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