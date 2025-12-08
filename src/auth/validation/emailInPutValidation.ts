import {body} from 'express-validator';


export const emailValidation = body('email')
    .isString()
    .withMessage('email should be string')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Uncorrected pattern of email')





export const authEmailValidation = [

];

