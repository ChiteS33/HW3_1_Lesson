import {Request, Response} from "express";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {CommentsService} from "./comments.service";
import {CommentsQueryRepository} from "../repositories/comments.queryRepository";
import {inject, injectable} from "inversify";
import "reflect-metadata"


@injectable()
export class CommentsController {


    constructor(@inject(CommentsService) public commentsService: CommentsService,
                @inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository) {
    }


    async deleteComment(req: Request, res: Response) {
        const commentId = req.params.id;
        const userLogin = req.user!.login
        const result = await this.commentsService.deleteComment(commentId, userLogin);

        return res.sendStatus(resultCodeToHttpException(result.status));
    }


    async getCommentById(req: Request, res: Response) {

        const commentId = req.params.id;
        const user = req.user


        const comment = await this.commentsQueryRepository.findByCommentId(commentId, user);

                if (comment.status !== "Success") {
            return res.sendStatus(resultCodeToHttpException(comment.status));
        }
        return res.status(resultCodeToHttpException(comment.status)).send(comment.data);
    }


    async updateComment(req: Request, res: Response) {
        const commentId = req.params.id;
        const body = req.body;
        const userLogin = req.user!.login;
        const updatedCommentResult = await this.commentsService.updateComment(commentId, body, userLogin)

        return res.sendStatus(resultCodeToHttpException(updatedCommentResult.status));
    }

    async createLikeForComment(req: Request, res: Response) {

        const commentId = req.params.id;
        const likeStatus = req.body.likeStatus;
        const userId = req.user!._id.toString();

        const result = await this.commentsService.setLikeStatus(commentId, userId, likeStatus)
        if (result.status !== "NoContent") {
            return res.status(resultCodeToHttpException(result.status)).send({errorMessages: result.extensions})
        }
        return res.sendStatus(resultCodeToHttpException(result.status));
    }
}