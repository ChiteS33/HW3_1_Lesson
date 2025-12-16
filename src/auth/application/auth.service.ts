import {usersRepository} from "../../users/repositories/users.repository";
import {hashServices} from "../../common/service/bcrypt.service";
import {ObjectId, WithId} from "mongodb";
import {UserInDb} from "../../users/types/userInDb";
import {emailAdapter} from "../../adapters/email-adapter";
import {add} from "date-fns";
import {valuesUserMakerForRepo} from "../../users/routes/mappers/valuesUserMaker";
import {UserInputDto} from "../../users/types/userInputDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {jwtService} from "../../common/service/jwt-service";
import {jwtDecode} from "jwt-decode";
import {deviceMapperForRepo} from "../../securityDevices/routes/mappers/deviceMapperForRepo";
import {Payload} from "../../common/types/payload";
import {devicesCollection} from "../../db/mongo.db";
import {devicesServices} from "../../securityDevices/application/securityDevices.service";


export const authServices = {

    async checking(logOrEmail: string, pass: string): Promise<ObjectResult<WithId<UserInDb> | null>> {
        const user = await usersRepository.findByLoginOrEmail(logOrEmail)
        if (!user) return {
            status: ResultStatus.Unauthorized,
            errorMessage: "loginOrEmail not founded",
            extensions: [{
                field: "loginOrEmail",
                message: "loginOrEmail is not founded"
            }],
            data: null
        }
        const isValid = await hashServices.compareHash(pass, user.password)
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
    },
    async createUser(body: UserInputDto): Promise<ObjectResult<null>> {

        const passwordHash: string = await hashServices.hashMaker(body.password)
        const user: WithId<UserInDb> | null = await usersRepository.findByLoginOrEmail(body.login)
        if (user) return {
            status: ResultStatus.BadRequest,
            errorMessage: "login already created",
            extensions: [{
                field: "login",
                message: "login already created",
            }],
            data: null
        }
        const emailUser = await usersRepository.findByLoginOrEmail(body.email)
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
        await usersRepository.create(newUser)
        emailAdapter.sendEmail(newUser.email, "ChiteS", newUser.emailConfirmation.confirmationCode)

        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }

    },
    async confirmEmail(code: string): Promise<ObjectResult<null>> {
        const user: WithId<UserInDb> | null = await usersRepository.findByCode(code)

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
            errorMessage: "Bad Request",
            extensions: [{
                field: "code",
                message: "Date is dead",
            }],
            data: null
        }


        await usersRepository.updateConfirmation(user._id)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    },
    async resendingEmail(email: string): Promise<ObjectResult<null>> {

        const foundEmail = await usersRepository.findByEmail(email)
        if (!foundEmail) return {
            status: ResultStatus.BadRequest,
            errorMessage: "email is not founded",
            extensions: [{
                field: "email",
                message: "email is not founded",
            }],
            data: null
        }

        const userId = foundEmail._id.toString()
        if (foundEmail.emailConfirmation.isConfirmed) return {
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

        await usersRepository.updateConfirmationCode(newConfirmationCode, newExpirationDate, userId)
        emailAdapter.sendEmail(foundEmail.email, "ChiteS", newConfirmationCode)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }

    },
    async login(loginOrEmail: string, password: string, deviceName: any, ip: any): Promise<ObjectResult<{
        token: string,
        refreshToken: string
    } | null>> {
        const user = await authServices.checking(loginOrEmail, password)
        if (user.status !== ResultStatus.Success) return {
            status: user.status,
            extensions: user.extensions,
            data: null
        }
        const userId = user.data!._id.toString()

        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId)
        const payload: Payload = jwtDecode(refreshToken)                                       // перенести в сервис

        await devicesServices.createSession(deviceMapperForRepo(payload, deviceName, ip))


        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {token, refreshToken}
        }
    },
    async refreshPairTokens(refreshToken: string): Promise<any> {


        const payloadRefreshToken: Payload = jwtDecode(refreshToken)
        const userId = payloadRefreshToken.userId
        const deviceId = payloadRefreshToken.deviceId

        const newAccessToken = await jwtService.createJWT(userId)
        const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId)

        const newPayload: Payload = jwtDecode(newRefreshToken)
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
    },


    async logout(refreshToken: string): Promise<any> {

        const foundSession = await devicesServices.findByUserIdAndDeviceId(refreshToken)

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
}








