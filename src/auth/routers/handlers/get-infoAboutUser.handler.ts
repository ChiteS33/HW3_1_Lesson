import {Request, Response} from 'express';
import {WithId} from "mongodb";
import {UserInDb} from "../../../users/types/userInDb";
import {HttpStatus} from "../../../core/types/http-statuses";





export async function getInfoAboutUserHandler(req: Request, res: Response) {

    const user: WithId<UserInDb> = req.user!

    const data = {
        email: user.email,
        login: user.login,
        userId: user._id.toString(),
    }


    return res.status(HttpStatus.Ok).send(data)
}


