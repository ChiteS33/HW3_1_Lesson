import {Request, Response} from 'express';
import {devicesServices} from "../../application/securityDevices.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";


export async function deleteByDeviceId(req: Request, res: Response) {

    const deviceId: string = req.params.id;
    const refreshToken = req.cookies.refreshToken;

    const result = await devicesServices.deleteByDeviceId(refreshToken, deviceId);

    if (result.status !== ResultStatus.NoContent) {
        return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    return res.sendStatus(resultCodeToHttpException(result.status));

}
