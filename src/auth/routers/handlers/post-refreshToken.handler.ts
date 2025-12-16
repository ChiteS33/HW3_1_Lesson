import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";


export async function refreshTokenHandler(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;

    const result = await authServices.refreshPairTokens(refreshToken)
    if (result.status !== "Success" || !result.data) {
        return res.sendStatus(resultCodeToHttpException(ResultStatus.Unauthorized))
    }


    res.cookie('refreshToken', result.data.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 20000
    });
    return res.status(resultCodeToHttpException(result.status)).send({accessToken: result.data.newAccessToken});
}



// 1. Берём рефрешь токен
// 2. Проверяем его время жизни
// 3. Ищем в БД такую сессию ( userId, deviceId)
// 4. Сравниваем даты (iat)
// 5. Генерим новую пару
// 6. Кидаем в БД новый iat