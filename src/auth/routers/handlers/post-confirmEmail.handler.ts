import {Request, Response} from 'express';
import {authServices} from "../../application/auth.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";





export async function confirmEmailHandler(req: Request, res: Response) {
    const code = req.body.code;
    const result = await authServices.confirmEmail(code);
    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCodeToHttpException(result.status)).send({errorsMessages: result.extensions})
        return;
    }
        return res.sendStatus(resultCodeToHttpException(result.status))
}
