import {Router} from 'express';
import {idValidation} from '../../core/middlewares/validation/params-id.validation-middleware';
import {inputValidationResultMiddleware} from '../../core/middlewares/validation/input-validtion-result.middleware';
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {blogInputDtoValidation} from "../validation/blogsInputValidation";
import {paginationValidationWithSearchName} from "../../common/validation/paginationValidationWithSearchName";
import {postInputDtoValidation} from "../../posts/validation/postInputValidation";
import {paginationValidation} from "../../common/validation/paginationValidation";
import {container} from "../../composition-root";
import {BlogsController} from "../application/blogs.controller";
import "reflect-metadata";




const blogsController = container.get(BlogsController);
export const blogsRouter = Router({});

blogsRouter
    .get('', paginationValidationWithSearchName, blogsController.getBlogList.bind(blogsController))
    .post('', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, blogsController.createBlog.bind(blogsController))
    .get('/:id/posts', idValidation, paginationValidation, inputValidationResultMiddleware, blogsController.getPostByBlogId.bind(blogsController))
    .post('/:id/posts',
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.createPostByBlogId.bind(blogsController)
    )
    .get('/:id', idValidation, inputValidationResultMiddleware, blogsController.getBlogById.bind(blogsController))
    .put(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        blogsController.updateBlog.bind(blogsController)
    )
    .delete(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        blogsController.deleteBlog.bind(blogsController)
    )


