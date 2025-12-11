import {ObjectId} from "mongodb";

export type DeviceInDb = {
    userId: ObjectId;
    deviceId: ObjectId;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}