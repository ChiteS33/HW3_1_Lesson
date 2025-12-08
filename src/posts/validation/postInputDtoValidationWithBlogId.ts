import {body} from 'express-validator';



export const titleValidation = body('title')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .notEmpty()
    .withMessage('Title should not be empty')
    .isLength({max: 30})
    .withMessage('Title length should be correct')

export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .notEmpty()
    .withMessage('shortDescription should not be empty')
    .isLength({max: 100})
    .withMessage('shortDescription length should be correct')

export const contentValidation = body('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .notEmpty()
    .withMessage('content should not be empty')
    .isLength({max: 1000})
    .withMessage('content length should be correct')

export const blogIdValidation = body('blogId')
    .isString()
    .withMessage('blogId should be string')
    .isMongoId()
    .withMessage('blogId should be MongoId type')



export const postInputDtoValidationWithBlogId = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
];