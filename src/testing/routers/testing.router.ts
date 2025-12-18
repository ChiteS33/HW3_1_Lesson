import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import {
    blogCollection,
    commentCollection, devicesCollection,
    postCollection, recoveryPassCollection, requestCounterCollection,
    userCollection
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
        userCollection.deleteMany(),
        commentCollection.deleteMany(),
        devicesCollection.deleteMany(),
        requestCounterCollection.deleteMany(),
        recoveryPassCollection.deleteMany(),

    ]);
    res.sendStatus(HttpStatus.NoContent);
});