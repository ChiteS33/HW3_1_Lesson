import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {jwtService, usersService} from "../../composition-root";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(HttpStatus.Unauthorized);
    const token = req.headers.authorization.split(' ')[1];
    const userId: any = await jwtService.getUserIdByToken(token);
    if (!userId) return res.sendStatus(HttpStatus.Unauthorized)
    const user = await usersService.findUserById(userId);
    if (!user) return res.sendStatus(HttpStatus.Unauthorized)
    req.user = user;

    next()
}


