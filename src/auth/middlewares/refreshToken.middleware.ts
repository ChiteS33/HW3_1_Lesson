import {NextFunction, Request, Response} from "express";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../common/types/objectResultTypes";
import {jwtService} from "../../common/service/jwt-service";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token not found"});
    }
    const userId = await jwtService.verifyRefreshToken(refreshToken)
    if (!userId) {
        return res.status(resultCodeToHttpException(ResultStatus.Unauthorized)).send({message: "Refresh token expired or invalid"});
    }
    next()
}