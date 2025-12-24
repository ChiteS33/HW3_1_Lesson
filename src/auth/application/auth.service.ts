import "reflect-metadata";
import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {add} from "date-fns";
import {UserInputDto} from "../../users/types/userInputDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {Payload} from "../../common/types/payload";
import {sessionCollection} from "../../db/mongo.db";
import {UsersRepository} from "../../users/repositories/users.repository";
import {HashService} from "../../common/service/bcrypt.service";
import {JwtService} from "../../common/service/jwt-service";
import {EmailAdapter} from "../../adapters/email-adapter";
import {AuthRepository} from "../repositories/authRepository";
import {UsersService} from "../../users/application/users.service";
import {UserDocument, UserModel} from "../../users/routes/users.entity";
import {SessionsService} from "../../securityDevices/application/sessions.service";
import {SessionsRepository} from "../../securityDevices/repositories/sessions.repository";
import {SessionModel} from "../../securityDevices/routes/sessions.entity";
import {RecoveryPassModel} from "../routers/auth.entity";



@injectable()
export class AuthService {


    constructor(@inject(UsersRepository) public usersRepository: UsersRepository,
                @inject(HashService) public hashService: HashService,
                @inject(EmailAdapter) public emailAdapter: EmailAdapter,
                @inject(JwtService) public jwtService: JwtService,
                @inject(SessionsService) public sessionsService: SessionsService,
                @inject(AuthRepository) public authRepository: AuthRepository,
                @inject(UsersService) public userService: UsersService,
                @inject(SessionsRepository) public sessionsRepository: SessionsRepository) {
    }


    async checking(logOrEmail: string, pass: string): Promise<ObjectResult<UserDocument | null>> {

        const user = await this.usersRepository.findByLoginOrEmail(logOrEmail)
        if (!user) return {
            status: ResultStatus.Unauthorized,
            errorMessage: "loginOrEmail not founded",
            extensions: [{
                field: "loginOrEmail",
                message: "loginOrEmail is not founded"
            }],
            data: null
        }

        const isValid = await this.hashService.compareHash(pass, user.password)
        if (!isValid) return {
            status: ResultStatus.Unauthorized,
            errorMessage: "password is not valid",
            extensions: [{
                field: "password",
                message: "password is not valid"
            }],
            data: null
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: user
        }
    }

    async createUser(body: UserInputDto): Promise<ObjectResult<null>> {
        const passwordHash: string = await this.hashService.hashMaker(body.password)
        const user: UserDocument | null = await this.usersRepository.findByLoginOrEmail(body.login)
        if (user) return {
            status: ResultStatus.BadRequest,
            errorMessage: "login already created",
            extensions: [{
                field: "login",
                message: "login already created",
            }],
            data: null
        }
        const emailUser = await this.usersRepository.findByLoginOrEmail(body.email)
        if (emailUser) return {
            status: ResultStatus.BadRequest,
            errorMessage: "email already created",
            extensions: [{
                field: "email",
                message: "email already created",
            }],
            data: null
        }

        const newUser = new UserModel()
        newUser.login = body.login
        newUser.email = body.email
        newUser.password = passwordHash
        newUser.createdAt = new Date()
        newUser.emailConfirmation.confirmationCode = crypto.randomUUID()
        newUser.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
        newUser.emailConfirmation.isConfirmed = false

        await this.usersRepository.save(newUser)
        await this.emailAdapter.sendEmail(newUser.email, "ChiteS", newUser.emailConfirmation.confirmationCode)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async confirmEmail(code: string): Promise<ObjectResult<null>> {
        const user: UserDocument | null = await this.usersRepository.findByCode(code)
        if (!user) return {
            status: ResultStatus.BadRequest,
            errorMessage: "Bad request",
            extensions: [{
                field: "code",
                message: "User is not founded",
            }],
            data: null
        }
        if (user.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorMessage: "Bad Request",
            extensions: [{
                field: "code",
                message: "code already confirmed",
            }],
            data: null
        }
        if (user.emailConfirmation.confirmationCode !== code) return {
            status: ResultStatus.BadRequest,
            errorMessage: "Bad Request",
            extensions: [{
                field: "code",
                message: "Code is not correct",
            }],
            data: null
        }
        if (user.emailConfirmation.expirationDate < new Date()) return {
            status: ResultStatus.BadRequest,
            errorMessage: "Date is dead",
            extensions: [{
                field: "code",
                message: "Date is dead",
            }],
            data: null
        }
        user.emailConfirmation.isConfirmed = true
        await this.usersRepository.save(user)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async resendingEmail(email: string): Promise<ObjectResult<null>> {
        const foundUser = await this.usersRepository.findByEmail(email)
        if (!foundUser) return {
            status: ResultStatus.BadRequest,
            errorMessage: "user is not founded",
            extensions: [{
                field: "email",
                message: "user is not founded",
            }],
            data: null
        }

        if (foundUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorMessage: "email is already confirmed",
            extensions: [{
                field: "email",
                message: "email is already confirmed",
            }],
            data: null
        }
        const newConfirmationCode = crypto.randomUUID()
        const newExpirationDate = add(new Date(), {hours: 1})
        foundUser.emailConfirmation.confirmationCode = newConfirmationCode
        foundUser.emailConfirmation.expirationDate = newExpirationDate

        await this.emailAdapter.sendEmail(foundUser.email, "ChiteS", newConfirmationCode)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }

    }

    async login(loginOrEmail: string, password: string, deviceName: string, ip: string): Promise<ObjectResult<{
        token: string,
        refreshToken: string
    } | null>> {
        const user = await this.checking(loginOrEmail, password)
        if (user.status !== ResultStatus.Success) return {
            status: user.status,
            extensions: user.extensions,
            data: null
        }
        const userId = user.data!._id.toString()
        const token = await this.jwtService.createJWT(userId);
        const refreshToken = await this.jwtService.createRefreshToken(userId)
        const payload: Payload = await this.jwtService.decodeJWT(refreshToken)

        const newSession = new SessionModel()
        newSession.userId = new ObjectId(payload.userId)
        newSession.deviceId = new ObjectId(payload.deviceId)
        newSession.iat = new Date(payload.iat * 1000)
        newSession.deviceName = deviceName
        newSession.ip = ip
        newSession.exp = new Date(payload.exp * 1000)
        await this.sessionsService.createSession(newSession)

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {token, refreshToken}
        }
    }

    async refreshPairTokens(refreshToken: string): Promise<ObjectResult<{
        newAccessToken: string,
        newRefreshToken: string
    }>> {
        const payloadRefreshToken: Payload = await this.jwtService.decodeJWT(refreshToken)
        const userId = payloadRefreshToken.userId
        const deviceId = payloadRefreshToken.deviceId
        const newAccessToken = await this.jwtService.createJWT(userId)
        const newRefreshToken = await this.jwtService.createRefreshToken(userId, deviceId)
        const newPayload: Payload = await this.jwtService.decodeJWT(newRefreshToken)
        const newIat = newPayload.iat
        const newExp = newPayload.exp
        const foundSession = await this.sessionsService.findByUserIdAndDeviceId(refreshToken)
        const newSession = new SessionModel(foundSession)
        newSession.iat = new Date(newIat * 1000)
        newSession.exp = new Date(newExp * 1000)
        await this.sessionsRepository.save(newSession)

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {newAccessToken, newRefreshToken}
        }
    }

    async logout(refreshToken: string): Promise<ObjectResult<null>> {
        const foundSession = await this.sessionsService.findByUserIdAndDeviceId(refreshToken)
        if (!foundSession.data) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Session not found",
                extensions: [{
                    field: "sessionId",
                    message: "Session not found",
                }],
                data: null
            }
        }
        await sessionCollection.deleteOne({_id: new ObjectId(foundSession.data._id)})
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async passRecovery(email: string): Promise<ObjectResult<null>> {

        const foundEmail: UserDocument | null = await this.usersRepository.findByEmail(email)
        if (!foundEmail) return {
            status: ResultStatus.NotFound,
            errorMessage: "email is not found",
            extensions: [{
                field: "email",
                message: "email is not found",
            }],
            data: null
        }
        const recoveryCode = crypto.randomUUID()
        const newResult = new RecoveryPassModel()
        newResult.email = email
        newResult.recoveryCode = recoveryCode
        await this.authRepository.save(newResult)

        await this.emailAdapter.resendEmail(email, recoveryCode)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: null
        }
    }

    async confirmRecoveryPass(newPassword: string, recoveryCode: string): Promise<ObjectResult<any>> {
        const foundEmail = await this.authRepository.findByRecoveryCode(recoveryCode)
        if (!foundEmail) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "email is not found",
                extensions: [{
                    field: "recoveryCode",
                    message: "recoveryCode is wrong or expired"
                }],
                data: null
            }
        }
        const foundUser: UserDocument | null = await this.userService.findUserByEmail(foundEmail)
        if (!foundUser) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "user not found",
                extensions: [{
                    field: "recoveryCode",
                    message: "user not found"
                }],
                data: null
            }
        }
        const newPassHash = await this.hashService.hashMaker(newPassword)
        await this.authRepository.changePassword(foundUser._id.toString(), newPassHash)
        await this.authRepository.deleteRecoveryCode(foundEmail)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }


}










