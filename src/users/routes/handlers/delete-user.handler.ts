import {Request, Response} from 'express';
import {usersServices} from "../../application/users.service";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";

export async function deleteUserHandler(req: Request, res: Response) {

    const userId = req.params.id;


    const result = await usersServices.delete(userId)

    return  res.sendStatus(resultCodeToHttpException(result.status));
}