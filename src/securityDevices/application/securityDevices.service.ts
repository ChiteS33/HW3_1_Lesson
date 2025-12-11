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
    async deleteAllExcludeCurrentUser(refreshToken: any, deviceName: any): Promise<ObjectResult<null>> {

        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const userId: string = payloadRefreshToken.userId
        await devicesRepository.deleteAlmostAll(userId, deviceName)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    },

    async findSessionById(sessionId: any): Promise<ObjectResult<any>> {

        const result = await devicesCollection.findOne({_id: sessionId})
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


    async deleteByDeviceId(refreshToken: any, sessionId: any): Promise<ObjectResult<any>> {

        const foundSession = await devicesServices.findSessionById(sessionId)
        if(!foundSession.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: foundSession.errorMessage,
                extensions: foundSession.extensions,
                data: null
            }
        }
        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const userId: string = payloadRefreshToken.userId

        await devicesRepository.deleteById(userId)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}
