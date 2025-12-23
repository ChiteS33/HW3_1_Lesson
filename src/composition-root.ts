import {AuthController} from "./auth/application/auth.controller";
import {AuthService} from "./auth/application/auth.service";
import {JwtService} from "./common/service/jwt-service";
import {UsersService} from "./users/application/users.service";
import {EmailAdapter} from "./adapters/email-adapter";
import {HashService} from "./common/service/bcrypt.service";
import {UsersRepository} from "./users/repositories/users.repository";
import {UsersQueryRepository} from "./users/repositories/users.QueryRepository";
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
import {UsersController} from "./users/application/users.controller";
import {AuthRepository} from "./auth/repositories/authRepository";
import {Container} from "inversify";
import {SessionsController} from "./securityDevices/application/sessions.controller";
import {SessionsService} from "./securityDevices/application/sessions.service";
import {SessionsRepository} from "./securityDevices/repositories/sessions.repository";
import {SessionsQueryRepository} from "./securityDevices/repositories/sessionsQueryRepository";






export const container = new Container();

container.bind(AuthController).to(AuthController);
container.bind(AuthService).to(AuthService);
container.bind(AuthRepository).to(AuthRepository);

container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

container.bind(SessionsController).to(SessionsController);
container.bind(SessionsService).to(SessionsService);
container.bind(SessionsRepository).to(SessionsRepository);
container.bind(SessionsQueryRepository).to(SessionsQueryRepository);

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

container.bind(HashService).to(HashService);
container.bind(EmailAdapter).to(EmailAdapter);
container.bind(JwtService).to(JwtService);







