import {Request, Response} from 'express';
import {usersServices} from "../../application/users.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {UserInputDto} from "../../types/userInputDto";
import {usersQueryRepository} from "../../repositories/users.QueryRepository";
import {UserOutPut} from "../../types/userOutPut";


export async function createUserHandler(req: Request, res: Response) {

    const body: UserInputDto = req.body;
    const userId: string | null | false = await usersServices.create(body);

    if (userId === false) {
        return res.status(HttpStatus.BadRequest).send({
            "errorsMessages": [
                {
                    "message": "Name already in use ",
                    "field": "name"
                }
            ]
        })
    }
    if (userId === null) {
        return res.status(HttpStatus.BadRequest).send({
            "errorsMessages": [
                {
                    "message": "Email already in use ",
                    "field": "email"
                }
            ]
        })


    }

    const createdUser: UserOutPut | null = await usersQueryRepository.findById(userId);
    if (!createdUser) {
        return res.sendStatus(HttpStatus.NotFound)
    }


    res.status(HttpStatus.Created).send(createdUser)
}
