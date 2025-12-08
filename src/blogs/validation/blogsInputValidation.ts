import {body} from 'express-validator';


export const nameValidation = body('name')
    .isString()
    .withMessage('name should be string')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({max: 15})
    .withMessage('Length of name is not correct');

export const descriptionValidation = body('description')
    .isString()
    .withMessage('description should be string')
    .trim()
    .notEmpty()
    .withMessage('descriptionValidation is required')
    .isLength({max: 500})
    .withMessage('Length of description is not correct');

export const websiteUrlValidation = body('websiteUrl')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .notEmpty()
    .withMessage('websiteUrl is required')
    .isLength({min: 0, max: 100})
    .withMessage('Length of email is not correct')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Uncorrected pattern of websiteUrl')




export const blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    ];

