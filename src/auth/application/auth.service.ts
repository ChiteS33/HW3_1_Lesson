import {ObjectId, WithId} from "mongodb";
import {UserInDb} from "../../users/types/userInDb";
import {add} from "date-fns";
import {valuesUserMakerForRepo} from "../../users/routes/mappers/valuesUserMaker";
import {UserInputDto} from "../../users/types/userInputDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {deviceMapperForRepo} from "../../securityDevices/routes/mappers/deviceMapperForRepo";
import {Payload} from "../../common/types/payload";
import {devicesCollection} from "../../db/mongo.db";
import {UsersRepository} from "../../users/repositories/users.repository";
import {HashService} from "../../common/service/bcrypt.service";
import {JwtService} from "../../common/service/jwt-service";
import {SessionsService} from "../../securityDevices/application/securityDevices.service";
import {EmailAdapter} from "../../adapters/email-adapter";
import {RecoveryPassInDb} from "../../common/types/recoveryPassInDb";
import {AuthRepository} from "../repositories/authRepository";
import {recoveryMapper} from "../../common/mapper/recoveryPassMapper";
import {UsersService} from "../../users/application/users.service";


export class AuthService {

    usersRepository: UsersRepository;
    hashService: HashService;
    emailAdapter: EmailAdapter;
    jwtService: JwtService;
    sessionsService: SessionsService;
    authRepository: AuthRepository;
    userService: UsersService


    constructor(usersRepository: UsersRepository, hashService: HashService, emailAdapter: EmailAdapter, jwtService: JwtService, sessionsService: SessionsService, authRepository: AuthRepository, userService: UsersService) {
        this.usersRepository = usersRepository;
        this.hashService = hashService;
        this.emailAdapter = emailAdapter;
        this.jwtService = jwtService;
        this.sessionsService = sessionsService;
        this.authRepository = authRepository;
        this.userService = userService;

    }


    async checking(logOrEmail: string, pass: string): Promise<ObjectResult<WithId<UserInDb> | null>> {
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
        const user: WithId<UserInDb> | null = await this.usersRepository.findByLoginOrEmail(body.login)
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
        const newUser: UserInDb = valuesUserMakerForRepo(body, passwordHash)
        await this.usersRepository.create(newUser)
        await this.emailAdapter.sendEmail(newUser.email, "ChiteS", newUser.emailConfirmation.confirmationCode)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async confirmEmail(code: string): Promise<ObjectResult<null>> {
        const user: WithId<UserInDb> | null = await this.usersRepository.findByCode(code)
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
        await this.usersRepository.updateConfirmation(user._id)
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
        const userId = foundUser._id.toString()
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
        await this.usersRepository.updateConfirmationCode(newConfirmationCode, newExpirationDate, userId)
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
        await this.sessionsService.createSession(deviceMapperForRepo(payload, deviceName, ip))
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
        await devicesCollection.updateOne({
                userId: new ObjectId(userId),
                deviceId: new ObjectId(deviceId)
            },
            {
                $set: {
                    iat: new Date(newIat * 1000),
                    exp: new Date(newExp * 1000)
                }
            })
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
        await devicesCollection.deleteOne({_id: new ObjectId(foundSession.data._id)})
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async passRecovery(email: string): Promise<ObjectResult<null>> {

        const foundEmail: WithId<UserInDb> | null = await this.usersRepository.findByEmail(email)
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
        const result: RecoveryPassInDb = recoveryMapper(email, recoveryCode)
        await this.authRepository.pushInDb(result)                    // пушим данные в Коллекцию
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
        const foundUser: WithId<UserInDb> | null = await this.userService.findUserByEmail(foundEmail)
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
        await this.authRepository.changePassword(foundUser, newPassHash)
        await this.authRepository.deleteRecoveryCode(foundEmail)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }


}










