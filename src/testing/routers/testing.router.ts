import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import {BlogModel} from "../../blogs/routers/blogs.entity";
import {PostModel} from "../../posts/routes/posts.entity";
import {UserModel} from "../../users/routes/users.entity";
import {CommentModel, LikeModel} from "../../comments/routers/comments.entity";
import {SessionModel} from "../../securityDevices/routes/sessions.entity";
import {RecoveryPassModel, RequestCounterModel} from "../../auth/routers/auth.entity";



export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {

    await Promise.all([
        BlogModel.deleteMany(),
        PostModel.deleteMany(),
        UserModel.deleteMany(),
        CommentModel.deleteMany(),
        SessionModel.deleteMany(),
        RequestCounterModel.deleteMany(),
        RecoveryPassModel.deleteMany(),
        LikeModel.deleteMany(),

    ]);
    res.sendStatus(HttpStatus.NoContent);
});