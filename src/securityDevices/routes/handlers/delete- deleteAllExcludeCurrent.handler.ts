import {Request, Response} from 'express';
import {devicesServices} from "../../application/securityDevices.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function deleteAllExcludeCurrent(req: Request, res: Response) {

    const refreshToken = req.cookies.refreshToken;

    const result = await devicesServices.deleteAllExcludeCurrentUser(refreshToken);

    return res.sendStatus(resultCodeToHttpException(result.status));

}

