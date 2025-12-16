import {WithId} from "mongodb";
import {DeviceInDb} from "../../types/deviceInDb";

export const deviceFinalMake = (result: WithId<DeviceInDb>): any => {

    return {
        ip: result.ip.toString(),
        title: result.deviceName,
        lastActiveDate: result.iat.toISOString(),
        deviceId: result.deviceId.toString(),
    }

}