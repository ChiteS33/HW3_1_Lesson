import {ObjectId} from "mongodb";
import {DeviceInDb} from "../../types/deviceInDb";
import {Payload} from "../../../common/types/payload";

export const deviceMapperForRepo = (payload: Payload, deviceName: string, ip: string): DeviceInDb => {
    return {
        userId: new ObjectId(payload.userId),
        deviceId: new ObjectId(payload.deviceId),
        iat: new Date(payload.iat * 1000),
        deviceName: deviceName,
        ip: ip,
        exp: new Date(payload.exp * 1000)
    }
}