import {Request, Response} from 'express';
import {devicesQueryRepository} from "../../repositories/devicesQueryRepository";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ObjectResult} from "../../../common/types/objectResultTypes";
import {DeviceOutPut} from "../../types/deviceOutPut";
import {jwtDecode} from "jwt-decode";
import {Payload} from "../../../common/types/payload";




export async function getAllDevices(req: Request, res: Response) {

    const refreshToken: string = req.cookies.refreshToken;
    const payloadRefreshToken: Payload = jwtDecode(refreshToken)
    const userId: string = payloadRefreshToken.userId


    const result: ObjectResult<DeviceOutPut[] | null> = await devicesQueryRepository.findAllDevicesByUserId(userId);

    if (result.status !== "Success") {
        return res. sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(resultCodeToHttpException(result.status)).send(result.data);

}


