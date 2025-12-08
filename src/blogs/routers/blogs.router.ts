import {Router} from 'express';
import {createBlogHandler} from './handlers/create-blog.handler';
import {updateBlogHandler} from './handlers/update-blog.handler';
import {deleteBlogHandler} from './handlers/delete-blog.handler';
import {idValidation} from '../../core/middlewares/validation/params-id.validation-middleware';
import {inputValidationResultMiddleware} from '../../core/middlewares/validation/input-validtion-result.middleware';
import {getBlogHandler} from "./handlers/get-blog.handler";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {getPostByBlogIdHandler} from "./handlers/get-postByBlogId.handler";
import {createPostByBlogIdHandler} from "./handlers/create-postByBlogId.handler";
import {blogInputDtoValidation} from "../validation/blogsInputValidation";
import {paginationValidationWithSearchName} from "../../common/validation/paginationValidationWithSearchName";
import {postInputDtoValidation} from "../../posts/validation/postInputValidation";
import {paginationValidation} from "../../common/validation/paginationValidation";

export const blogsRouter = Router({});


blogsRouter
    .get('', paginationValidationWithSearchName, getBlogListHandler)  //
    .post('', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler) //
    .get('/:id/posts', idValidation, paginationValidation, inputValidationResultMiddleware, getPostByBlogIdHandler)  //
    .post('/:id/posts',
        superAdminGuardMiddleware,
        idValidation,
        postInputDtoValidation,
        inputValidationResultMiddleware,
        createPostByBlogIdHandler)                                                                                         //
    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
    .put(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        updateBlogHandler,
    )
    .delete(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler,
    )


