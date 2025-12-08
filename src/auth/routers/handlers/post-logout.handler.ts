import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";





export async function logoutHandler(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;
    const result = await authServices.logout(refreshToken);

       return res.sendStatus(resultCodeToHttpException(result.status));
}
