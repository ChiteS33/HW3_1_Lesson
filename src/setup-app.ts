
import express, {Express} from 'express';
import {testingRouter} from './testing/routers/testing.router';
import {
    AUTH_PATH,
    BLOGS_PATH,
    COMMENT_PATH,
    DEVICES_PATH,
    POSTS_PATH,
    TESTING_PATH,
    USERS_PATH
} from './core/paths/paths';
import {blogsRouter} from "./blogs/routers/blogs.router";
import {postsRouter} from "./posts/routes/posts.router";
import {usersRouter} from "./users/routes/users.router";
import {authRouter} from "./auth/routers/auth.router";
import {commentsRouter} from "./comments/routers/comments.router";
import cookieParser from "cookie-parser";
import {sessionsRouter} from "./securityDevices/routes/sessionsRouter";


export const setupApp = (app: Express) => {
    app.use(express.json());
    app.use(cookieParser())
    app.get('/', (req, res) => {
        res.status(200).send('hello world!!!');
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(COMMENT_PATH, commentsRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(DEVICES_PATH, sessionsRouter)


    return app;
};