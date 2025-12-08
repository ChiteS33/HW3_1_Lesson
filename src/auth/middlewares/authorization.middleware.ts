import {NextFunction, Request, Response} from "express";
import {usersServices} from "../../users/application/users.service";
import {jwtService} from "../../common/service/jwt-service";
import {HttpStatus} from "../../core/types/http-statuses";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(HttpStatus.Unauthorized);


    const token = req.headers.authorization.split(' ')[1];

    const userId: any = await jwtService.getUserIdByToken(token);

    if (!userId) return res.sendStatus(HttpStatus.Unauthorized)
    const user = await usersServices.findUserById(userId);
    if (!user) return res.sendStatus(HttpStatus.Unauthorized)

    req.user = user;
    next()
}


