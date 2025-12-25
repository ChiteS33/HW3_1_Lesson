import {container} from "../../composition-root";
import {JwtService} from "../../common/service/jwt-service";
import {UsersService} from "../../users/application/users.service";
import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";

const jwtService = container.get(JwtService)
const usersService = container.get(UsersService);



export const authorizationForCommentWitLike
    = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization){
        req.user = null;
        return next()
    }


    const token = req.headers.authorization.split(' ')[1];
    const userId: any = await jwtService.getUserIdByToken(token);
    if (!userId) return res.sendStatus(HttpStatus.Unauthorized)
    const user = await usersService.findUserById(userId);
    if (!user) return res.sendStatus(HttpStatus.Unauthorized)
    req.user = user.data;

    next()
}

