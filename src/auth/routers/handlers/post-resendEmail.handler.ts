import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function resendEmailHandler(req: Request, res: Response) {
    const email = req.body.email;
    const result = await authServices.resendingEmail(email)

    if(result.status !== ResultStatus.NoContent) {
        res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions})
        return;
    }
    return res.sendStatus(resultCodeToHttpException(result.status))
}
