import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {UserInputDto} from "../../../users/types/userInputDto";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function registrationInSystemHandler(req: Request, res: Response) {
    const body: UserInputDto = req.body;
    const user = await authServices.createUser(body);

    if (user.status !== ResultStatus.NoContent) {
        res.status(resultCodeToHttpException(user.status)).send({errorsMessages: user.extensions})
        return
    }
        return  res.sendStatus(resultCodeToHttpException(user.status))
}
