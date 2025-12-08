import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function refreshTokenHandler(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return  res.sendStatus(401)
    }

    const result = await authServices.refreshToken(refreshToken)
    if (result.status !== "Success" || !result.data) {
        return res.sendStatus(resultCodeToHttpException(result.status))
    }


    res.cookie('refreshToken', result.data.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 20000
    });
    return res.status(resultCodeToHttpException(result.status)).send({accessToken: result.data.newAccessToken});
}

