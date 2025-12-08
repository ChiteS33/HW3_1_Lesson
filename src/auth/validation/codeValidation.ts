import {body} from 'express-validator';


export const codeValidation = body('code')
    .isString()
    .withMessage('code should be string')
    .trim()
    .notEmpty()
    .withMessage('code is required')




export const codeInPutValidation = [
    codeValidation
];

