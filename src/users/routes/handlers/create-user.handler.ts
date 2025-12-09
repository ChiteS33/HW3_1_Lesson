import {Request, Response} from 'express';
import {usersServices} from "../../application/users.service";
import {UserInputDto} from "../../types/userInputDto";
import {usersQueryRepository} from "../../repositories/users.QueryRepository";
import {resultCodeToHttpException} from "../../../common/mapper/resultCodeToHttp";
import {ResultStatus} from "../../../common/types/objectResultTypes";


export async function createUserHandler(req: Request, res: Response) {

    const body: UserInputDto = req.body;

    const createdUserId = await usersServices.create(body);
    if (!createdUserId.data) {
        return res.status(resultCodeToHttpException(createdUserId.status)).send(`{errorsMessages: [{${createdUserId.extensions}]}`);
    }
    const createdUser = await usersQueryRepository.findById(createdUserId.data);
    if (createdUser.status === ResultStatus.Created) {
        return res.sendStatus(resultCodeToHttpException(createdUser.status));
    }
    return res.status(resultCodeToHttpException(createdUser.status)).send(createdUser.data);
}
