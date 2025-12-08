import {body} from 'express-validator';


export const contentValidation = body('content')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({min:20, max: 300})
    .withMessage('Content of name is not correct');




export const commentInputDtoValidation = [
    contentValidation
];

