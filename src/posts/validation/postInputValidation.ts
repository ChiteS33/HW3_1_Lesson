import {contentValidation, shortDescriptionValidation, titleValidation} from "./postInputDtoValidationWithBlogId";


export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,

];