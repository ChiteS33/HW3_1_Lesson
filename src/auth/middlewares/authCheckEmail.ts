import {body} from 'express-validator';


 const emailValidation = body('email')
    .isString()
    .withMessage('email should be string')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('Uncorrected pattern of email')





export const emailValidationForRecovery = [
    emailValidation
];