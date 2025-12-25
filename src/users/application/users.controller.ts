import {inject, injectable} from "inversify";
import {Request, Response} from 'express';
import {
    InPutPaginationWithSearchLoginTermAndSearchEMailTerm
} from "../../common/types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {UserOutPut} from "../types/userOutPut";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {UserInputDto} from "../types/userInputDto";
import {UsersQueryRepository} from "../repositories/users.QueryRepository";
import {UsersService} from "./users.service";



@injectable()
export class UsersController {


    constructor(
        @inject(UsersQueryRepository) public usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) public usersService: UsersService
    ) {
    }


    async getUserList(req: Request, res: Response) {

        const query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm = req.query
        const users: ObjectResult<FinalWithPagination<UserOutPut>> = await this.usersQueryRepository.findAll(query)
        if (users.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(users.status))
        }
        return res.status(resultCodeToHttpException(users.status)).send(users.data);
    }

    async createUser(req: Request, res: Response) {

        const body: UserInputDto = req.body;
        const createdUserId = await this.usersService.create(body)
        if (createdUserId.status !== ResultStatus.Created) {
            return res.status(resultCodeToHttpException(createdUserId.status)).send({errorsMessages: createdUserId.extensions});
        }
        const createdUser = await this.usersQueryRepository.findById(createdUserId.data!)

        if (createdUser.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(createdUserId.status))
        }
        return res.status(resultCodeToHttpException(ResultStatus.Created)).send(createdUser.data);
    }

    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;
                const result = await this.usersService.delete(userId);
        return res.sendStatus(resultCodeToHttpException(result.status))
    }


}