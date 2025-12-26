import {Request, Response} from "express";
import {Payload} from "../../common/types/payload";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {DeviceOutPut} from "../types/deviceOutPut";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {SessionsQueryRepository} from "../repositories/sessionsQueryRepository";
import {JwtService} from "../../common/service/jwt-service";
import {inject, injectable} from "inversify";
import {SessionsService} from "./sessions.service";
import "reflect-metadata"


@injectable()
export class SessionsController {


    constructor(@inject(SessionsQueryRepository) public sessionsQueryRepository: SessionsQueryRepository,
                @inject(JwtService) public jwtService: JwtService,
                @inject(SessionsService) public sessionsService: SessionsService) {
    }


    async getAllDevices(req: Request, res: Response) {
        const refreshToken: string = req.cookies.refreshToken;
        const payloadRefreshToken: Payload = await this.jwtService.decodeJWT(refreshToken)
        const userId: string = payloadRefreshToken.userId
        const result: ObjectResult<DeviceOutPut[] | null> = await this.sessionsQueryRepository.findAllDevicesByUserId(userId);
        if (result.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(result.status));
        }
        return res.status(resultCodeToHttpException(result.status)).send(result.data);
    }


    async deleteAllExcludeCurrent(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.sessionsService.deleteAllExcludeCurrentUser(refreshToken);
        return res.sendStatus(resultCodeToHttpException(result.status));
    }


    async deleteByDeviceId(req: Request, res: Response) {
        const deviceId: string = req.params.id;
        const refreshToken = req.cookies.refreshToken;
        const result = await this.sessionsService.deleteByDeviceId(refreshToken, deviceId);
        if (result.status !== ResultStatus.NoContent) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        }
        return res.sendStatus(resultCodeToHttpException(result.status));
    }


}