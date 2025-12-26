import {body} from "express-validator";
import {LikeDislikeStatus} from "../../comments/routers/comments.entity";
const likeStatusFromEnum = Object.values(LikeDislikeStatus)



export const likeStatusValidation = body('likeStatus')
    .isIn(likeStatusFromEnum)
    .withMessage('LikeStatus must by correct(Like, Dislike, None')





export const likeValidation = [
    likeStatusValidation

];
