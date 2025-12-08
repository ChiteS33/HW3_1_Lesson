import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";



export async function tryLoginUserHandler(req: Request, res: Response) {

    const {loginOrEmail, password} = req.body;
    const result = await authServices.login(loginOrEmail, password);

    if (result.status !== "Success" || !result.data) {
        res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions})
        return
    }

    res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 20000
    });



     return  res.status(resultCodeToHttpException(result.status)).send({accessToken: result.data.token});
}

