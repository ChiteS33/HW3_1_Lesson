import {body} from 'express-validator';


export const newPassValidation = body('newPassword')
    .isString()
    .withMessage('newPassword should be string')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isLength({min: 6, max: 20})
    .withMessage('Length of newPassword is not correct');

export const recoveryCodeValidation = body('recoveryCode')
    .isString()
    .withMessage('recovery-code should be string')


export const passAndCodeValidation = [
    newPassValidation,
    recoveryCodeValidation,
];