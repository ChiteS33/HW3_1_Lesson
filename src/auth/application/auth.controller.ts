import {Request, Response} from 'express';
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../common/types/objectResultTypes";
import {UserInputDto} from "../../users/types/userInputDto";
import {AuthService} from "./auth.service";
import {inject, injectable} from "inversify";
import "reflect-metadata";


@injectable()
export class AuthController {


    constructor(@inject(AuthService) public authService: AuthService) {
    }


    async getInfoAboutUser(req: Request, res: Response) {
        const user = req.user!
        const data = {
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        }
        return res.status(resultCodeToHttpException(ResultStatus.Success)).send(data)
    }

    async tryLoginInUser(req: Request, res: Response) {
        const deviceName = req.headers['user-agent'] as string
        const ip = req.ip as string;
        const {loginOrEmail, password} = req.body;
        const result = await this.authService.login(loginOrEmail, password, deviceName, ip);
        if (result.status !== "Success" || !result.data) {
            return res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions});
        }
        res.cookie('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 20000000                        // 20000
        });
        return res.status(resultCodeToHttpException(result.status)).send({accessToken: result.data.token})
    }

    async confirmEmail(req: Request, res: Response) {
        const code = req.body.code
        const result = await this.authService.confirmEmail(code);
        if (result.status !== ResultStatus.NoContent) {
            res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions})
            return;
        }
        return res.sendStatus(resultCodeToHttpException(result.status))
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.authService.logout(refreshToken);
        return res.sendStatus(resultCodeToHttpException(result.status));
    }

    async refreshPairToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.authService.refreshPairTokens(refreshToken)
        if (result.status !== "Success" || !result.data) {
            return res.sendStatus(resultCodeToHttpException(ResultStatus.Unauthorized))
        }
        res.cookie('refreshToken', result.data.newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 20000
        });
        return res.status(resultCodeToHttpException(result.status)).send({accessToken: result.data.newAccessToken});
    }

    async registrationInSystem(req: Request, res: Response) {
        const body: UserInputDto = req.body;
        const user = await this.authService.createUser(body);
        if (user.status !== ResultStatus.NoContent) {
            return res.status(resultCodeToHttpException(user.status)).send({errorsMessages: user.extensions})
        }
        return res.sendStatus(resultCodeToHttpException(user.status))
    }

    async resendEmail(req: Request, res: Response) {
        const email = req.body.email;
        const result = await this.authService.resendingEmail(email)
        if (result.status !== ResultStatus.NoContent) {
            return res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions})
        }
        return res.sendStatus(resultCodeToHttpException(result.status))
    }

    async passRecovery(req: Request, res: Response) {
        const email = req.body.email;
        await this.authService.passRecovery(email)
        return res.sendStatus(resultCodeToHttpException(ResultStatus.NoContent))
    }

    async confirmPassRecovery(req: Request, res: Response) {
        const recoveryCode: string = req.body.recoveryCode;
        const newPassword: string = req.body.newPassword;
        const result = await this.authService.confirmRecoveryPass(newPassword, recoveryCode);
        if (result.status !== ResultStatus.NoContent) {
            return res.status(resultCodeToHttpException(ResultStatus.BadRequest)).send({errorsMessages: result.extensions})
        }
        return res.sendStatus(resultCodeToHttpException(result.status))
    }


}

