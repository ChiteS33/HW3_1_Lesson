import {AuthController} from "./auth/application/auth.controller";
import {AuthService} from "./auth/application/auth.service";
import {SessionsService} from "./securityDevices/application/securityDevices.service";
import {SessionsQueryRepository} from "./securityDevices/repositories/sessionsQueryRepository";
import {JwtService} from "./common/service/jwt-service";
import {UsersService} from "./users/application/users.service";
import {EmailAdapter} from "./adapters/email-adapter";
import {HashService} from "./common/service/bcrypt.service";
import {UsersRepository} from "./users/repositories/users.repository";
import {UsersQueryRepository} from "./users/repositories/users.QueryRepository";
import {SessionsRepository} from "./securityDevices/repositories/securityDevices.repository";
import {BlogsController} from "./blogs/application/blogs.controller";
import {PostsQueryRepository} from "./posts/repositories/postsQueryRepository";
import {PostsController} from "./posts/application/posts.controller";
import {PostsService} from "./posts/application/posts.service";
import {BlogsService} from "./blogs/application/blogs.service";
import {PostsRepository} from "./posts/repositories/postsRepository";
import {CommentsRepository} from "./comments/repositories/comments.repository";
import {BlogsRepository} from "./blogs/repositories/blogs.repository";
import {CommentsQueryRepository} from "./comments/repositories/comments.queryRepository";
import {CommentsService} from "./comments/application/comments.service";
import {BlogsQueryRepository} from "./blogs/repositories/blogs.queryRepository";
import {CommentsController} from "./comments/application/comments.controller";
import {SessionsController} from "./securityDevices/application/sessions.controller";
import {UsersController} from "./users/application/users.controller";
import {AuthRepository} from "./auth/repositories/authRepository";





export const usersRepository = new UsersRepository();
export const hashService = new HashService();
export const emailAdapter = new EmailAdapter();
export const jwtService = new JwtService();
export const authRepository = new AuthRepository()
export const sessionsRepository = new SessionsRepository();
export const sessionsService = new SessionsService(sessionsRepository, jwtService);
export const usersService = new UsersService(hashService, usersRepository);
export const authService = new AuthService(usersRepository, hashService, emailAdapter, jwtService, sessionsService, authRepository, usersService);
export const authController = new AuthController(authService);
export const postsQueryRepository = new PostsQueryRepository();
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogsRepository = new BlogsRepository();
export const blogsService = new BlogsService(blogsRepository);
export const postsRepository = new PostsRepository();
export const postsService = new PostsService(blogsService, postsRepository);
export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsService, postsQueryRepository);
export const commentsQueryRepository = new CommentsQueryRepository(postsService);
export const commentsRepository = new CommentsRepository();
export const commentsService = new CommentsService(postsService, commentsRepository);
export const commentsController = new CommentsController(commentsService, commentsQueryRepository);
export const postsController = new PostsController(commentsQueryRepository, commentsService, postsService, postsQueryRepository);
export const sessionsQueryRepository = new SessionsQueryRepository();
export const sessionsController = new SessionsController(sessionsQueryRepository, jwtService, sessionsService);
export const usersQueryRepository = new UsersQueryRepository();
export const usersController = new UsersController(usersQueryRepository, usersService);






