import {body} from 'express-validator';


export const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .withMessage('name should be string')
    .trim()
    .notEmpty()
    .withMessage('loginOrEmail is required')

export const passwordValidation = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .notEmpty()
    .withMessage('password is required')





export const blogInputDtoValidation = [
    loginOrEmailValidation,
    passwordValidation
];

