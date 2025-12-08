import {body} from "express-validator";


export const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .withMessage("loginOrEmail should be a string")

export const passwordValidation = body('password')
    .isString()
    .withMessage("passwords should be a string")


export const paginationValidation = [
    loginOrEmailValidation,
    passwordValidation

];
