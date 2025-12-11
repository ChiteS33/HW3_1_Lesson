import {Request, Response} from 'express';
import {devicesServices} from "../../application/securityDevices.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function deleteAllExcludeCurrent(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;
    const deviceName = req.headers.deviceName;

    const result = await devicesServices.deleteAllExcludeCurrentUser(refreshToken, deviceName);
    return res.send(resultCodeToHttpException(result.status));

}


// Удалить все сессии, кроме этой.