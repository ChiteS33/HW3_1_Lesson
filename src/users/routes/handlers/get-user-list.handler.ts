import {Request, Response} from 'express';
import {
    InPutPaginationWithSearchLoginTermAndSearchEMailTerm
} from "../../../common/types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";
import {usersQueryRepository} from "../../repositories/users.QueryRepository";
import {ResultStatus} from "../../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";


export async function getUserListHandler(req: Request, res: Response) {

    const query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm = req.query;

    const users = await usersQueryRepository.findAll(query);
    if (users.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(users.status));
    }

    return res.status(resultCodeToHttpException(users.status)).send(users.data);
}