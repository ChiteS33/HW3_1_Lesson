import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {jwtDecode} from "jwt-decode";
import {devicesRepository} from "../repositories/securityDevices.repository";
import {Payload} from "../../common/types/payload";
import {devicesCollection} from "../../db/mongo.db";
import {DeviceInDb} from "../types/deviceInDb";
import {ObjectId, WithId} from "mongodb";


export const devicesServices = {

    async findByUserIdAndDeviceId(refreshToken: any): Promise<ObjectResult<WithId<DeviceInDb> | null>> {

        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const userId = new ObjectId(payloadRefreshToken.userId)
        const deviceId = new ObjectId(payloadRefreshToken.deviceId)
        const foundSession: WithId<DeviceInDb> | null = await devicesCollection.findOne({userId, deviceId})
        if (!foundSession) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Session not found",
                extensions: [{
                    field: "session",
                    message: "Session not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundSession
        }

    },
    async createSession(info: any): Promise<ObjectResult<string>> {
        const sessionId = await devicesRepository.createSession(info)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: sessionId
        }
    },
    async deleteAllExcludeCurrentUser(refreshToken: any): Promise<ObjectResult<null>> {

        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const deviceId = payloadRefreshToken.deviceId
        const userId: string = payloadRefreshToken.userId

        await devicesRepository.deleteAlmostAll(userId, deviceId)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    },

    async findSessionById(deviceId: any): Promise<ObjectResult<WithId<DeviceInDb> | null>> {

        const result = await devicesCollection.findOne({deviceId: new ObjectId(deviceId)})
        if (!result) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Session not found",
                extensions: [{
                    field: 'sessionId',
                    message: 'Session not found'
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: result
        }
    },

    async deleteByDeviceId(refreshToken: any, deviceId: string): Promise<ObjectResult<any>> {

        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const userId: string = payloadRefreshToken.userId

        const foundSessionByUserIdFromToken: ObjectResult<WithId<DeviceInDb> | null> = await devicesServices.findSessionById(deviceId)

        if (!foundSessionByUserIdFromToken.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: foundSessionByUserIdFromToken.errorMessage,
                extensions: foundSessionByUserIdFromToken.extensions,
                data: null
            }
        }
        const userIdFromSession = foundSessionByUserIdFromToken.data.userId



        if (userIdFromSession.toString() !== userId) {
            return {
                status: ResultStatus.Forbidden,
                errorMessage: "User has`t rights",
                extensions: [{
                    field: 'userId',
                    message: 'User has`t rights'
                }],
                data: null
            }
        }

        await devicesRepository.deleteById(deviceId)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}
