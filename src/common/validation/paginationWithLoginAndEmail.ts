import {pageNumber, pageSize, sortBy, sortDirection} from "./paginationValidationWithSearchName";
import {query} from "express-validator";

export const searchLoginTermValidation = query('searchLoginTerm')
    .optional()
    .isString()
    .withMessage("sortBy should be a string")


export const searchEmailTermValidation = query('searchEmailTerm')
    .optional()
    .isString()
    .withMessage("searchEmailTerm should be a string")

export const paginationValidationWithEmailAndLogin = [
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchLoginTermValidation,
    searchEmailTermValidation

]


