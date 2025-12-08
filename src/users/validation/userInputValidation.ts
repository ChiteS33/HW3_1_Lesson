import {body} from 'express-validator';


export const loginValidation = body('login')
    .isString()
    .withMessage('name should be string')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min: 3, max: 10})
    .withMessage('Length of login is not correct')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Uncorrected pattern of login')

export const passwordValidation = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({min: 6, max: 20})
    .withMessage('Length of password is not correct');


export const emailValidation = body('email')
    .isString()
    .matches(/^[\+\w\-.]+@([\w\-]+.)+[\w-]{2,4}$/)
    // .isLength({min: 6, max: 20})
    .withMessage('incorrect email');



export const userInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
];

