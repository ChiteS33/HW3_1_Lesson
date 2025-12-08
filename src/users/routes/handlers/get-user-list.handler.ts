import {Request, Response} from 'express';
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {InPutPaginationWithSearchLoginTermAndSearchEMailTerm}
    from "../../../common/types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";
import {UserOutPut} from "../../types/userOutPut";
import {HttpStatus} from "../../../core/types/http-statuses";
import {usersQueryRepository} from "../../repositories/users.QueryRepository";


export async function getUserListHandler(req: Request, res: Response) {

    const query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm = req.query;

    const users: FinalWithPagination<UserOutPut> = await usersQueryRepository.findAll(query);

    res.status(HttpStatus.Ok).send(users);
}