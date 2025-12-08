import {usersRepository} from "../../users/repositories/users.repository";
import {hashServices} from "../../common/service/bcrypt.service";
import {WithId} from "mongodb";
import {UserInDb} from "../../users/types/userInDb";
import {emailAdapter} from "../../adapters/email-adapter";
import {add} from "date-fns";
import {valuesUserMakerForRepo} from "../../users/routes/mappers/valuesUserMaker";
import {UserInputDto} from "../../users/types/userInputDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {jwtService} from "../../common/service/jwt-service";
import {jwtDecode} from "jwt-decode";
import {authRepository} from "../repositories/auth.repository";


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
        await emailAdapter.sendEmail(newUser.email, "ChiteS", newUser.emailConfirmation.confirmationCode)

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
        await emailAdapter.sendEmail(foundEmail.email, "ChiteS", newConfirmationCode)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }

    },
    async login(loginOrEmail: string, password: string): Promise<ObjectResult<{ token: string, refreshToken: string} | null>> {
        const user = await authServices.checking(loginOrEmail, password)
        if (user.status !== ResultStatus.Success) return {
            status: user.status,
            extensions: user.extensions,
            data: null
        }

        const token = await jwtService.createJWT(user.data!._id.toString());
        const refreshToken = await jwtService.createRefreshToken(user.data!._id.toString())

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {token, refreshToken}
        }
    },
    async refreshToken(refreshToken: string): Promise<any> {

        if (!refreshToken) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{
                    field: "refreshToken",
                    message: "refreshToken is not founded"
                }],
                data: null
            }
        }                                         // проверка на наличие токена
        const payloadRefreshToken: Payload = jwtDecode(refreshToken)     // достали payload
        const timeRefreshToken = payloadRefreshToken.exp         // достали expiresIn
        const id = payloadRefreshToken.userId
        const userId = await jwtService.verifyRefreshToken(refreshToken);
        if (!userId) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{
                    field: "refreshToken",
                    message: "Refresh token expired or invalid"
                }],
                data: null
            };
        }

        const checkToken = await authRepository.findTokenInBlackList(refreshToken)   // проверка в black List
        if (checkToken) return {
            status: ResultStatus.Unauthorized,
            extensions: [{
                field: "refreshToken",
                message: "refreshToken is dead",
            }],
            data: null
        }                     // на его наличие

         await authRepository.pushTokenInDb(refreshToken, timeRefreshToken) // пуш в БД


        const newAccessToken = await jwtService.createJWT(id)                // создание нового токена
        const newRefreshToken = await jwtService.createRefreshToken(id)      // создание нового refreshToken

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {newAccessToken, newRefreshToken}
        }
    },


    async logout(refreshToken: string): Promise<any> {
        if (!refreshToken) return {
            status: ResultStatus.Unauthorized,
            extensions: [],
            data: null
        }  // проверка на наличие Токена

        const userId = await jwtService.verifyRefreshToken(refreshToken);
        if (!userId) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ message: 'Refresh token expired or invalid' }],
                data: null
            };
        }

        const payload: Payload = jwtDecode(refreshToken)
        const expiresIn = payload.exp

        const result = await authRepository.findTokenInBlackList(refreshToken)  // Ищем его в БД
        if (result) return {
            status: ResultStatus.Unauthorized,
            extensions: [],
            data: null
        }                    // если нашли, то он не валидный

         await authRepository.pushTokenInDb(refreshToken, expiresIn)  // запушили в BL
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}


export type Payload = {
    userId: string,
    iat: number,
    exp: number,
}


