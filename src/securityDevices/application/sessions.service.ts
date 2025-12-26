import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {Payload} from "../../common/types/payload";
import {WithId} from "mongodb";
import {JwtService} from "../../common/service/jwt-service";
import {inject, injectable} from "inversify";
import {SessionDocument, SessionInDb, SessionModel} from "../routes/sessions.entity";
import {SessionsRepository} from "../repositories/sessions.repository";
import "reflect-metadata"


@injectable()
export class SessionsService {


    constructor(@inject(SessionsRepository) public sessionsRepository: SessionsRepository,
                @inject(JwtService) public jwtService: JwtService) {
    }


    async findByUserIdAndDeviceId(refreshToken: any): Promise<ObjectResult<WithId<SessionInDb> | null>> {
        const payloadRefreshToken: Payload = await this.jwtService.decodeJWT(refreshToken)
        const userId = payloadRefreshToken.userId
        const deviceId = payloadRefreshToken.deviceId
        const foundSession: WithId<SessionInDb> | null = await this.sessionsRepository.findByUserIdAndDeviceId(userId, deviceId)
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
    }

    async createSession(session: SessionDocument): Promise<ObjectResult<string>> {
        const sessionId: string = await this.sessionsRepository.save(session)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: sessionId
        }
    }

    async deleteAllExcludeCurrentUser(refreshToken: any): Promise<ObjectResult<null>> {
        const payloadRefreshToken: Payload = await this.jwtService.decodeJWT(refreshToken)
        const deviceId = payloadRefreshToken.deviceId
        const userId: string = payloadRefreshToken.userId
        await this.sessionsRepository.deleteAlmostAll(userId, deviceId)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async findSessionById(deviceId: any): Promise<ObjectResult<SessionDocument | null>> {
        const result: SessionDocument | null = await SessionModel.findOne({deviceId: deviceId})
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
    }

    async deleteByDeviceId(refreshToken: any, deviceId: string): Promise<ObjectResult<any>> {
        const payloadRefreshToken: Payload = await this.jwtService.decodeJWT(refreshToken)
        const userId: string = payloadRefreshToken.userId
        const foundSessionByUserIdFromToken: ObjectResult<SessionDocument | null> = await this.findSessionById(deviceId)
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
        await this.sessionsRepository.deleteById(deviceId)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }


}


