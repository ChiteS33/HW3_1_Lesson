import {Request, Response} from 'express';
import {usersRepository} from "../../repositories/users.repository";
import {usersServices} from "../../application/users.service";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function deleteUserHandler(req: Request, res: Response) {

    const id = req.params.id;
    const user = await usersRepository.findById(id)
    if (!user) {
        res.sendStatus(HttpStatus.NotFound)
        return
    }
    await usersServices.delete(id)
    res.sendStatus(HttpStatus.NoContent)
}