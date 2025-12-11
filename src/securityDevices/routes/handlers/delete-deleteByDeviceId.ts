import {Request, Response} from 'express';
import {devicesServices} from "../../application/securityDevices.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";


export async function deleteByDeviceId(req: Request, res: Response) {

    const sessionId = req.params.id;
    const refreshToken = req.cookies.refreshToken;

    const result = await devicesServices.deleteByDeviceId(refreshToken, sessionId);
    if (result.status !== ResultStatus.NoContent) {
        return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    return res.sendStatus(resultCodeToHttpException(result.status));

}
