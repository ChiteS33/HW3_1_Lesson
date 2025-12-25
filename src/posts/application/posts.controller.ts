import {Request, Response} from "express";
import {CommentInPut} from "../../comments/types/commentInPut";
import {ResultStatus} from "../../common/types/objectResultTypes";
import {resultCodeToHttpException} from "../../common/mapper/resultCodeToHttp";
import {InPutPagination} from "../../common/types/inPutPagination";
import {PostInputDto} from "../types/post-input.dto";
import {CommentsQueryRepository} from "../../comments/repositories/comments.queryRepository";
import {CommentsService} from "../../comments/application/comments.service";
import {PostsService} from "./posts.service";
import {PostsQueryRepository} from "../repositories/postsQueryRepository";
import {inject, injectable} from "inversify";
import "reflect-metadata"


@injectable()
export class PostsController {


    constructor(@inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService) public commentsService: CommentsService,
                @inject(PostsService) public postsService: PostsService,
                @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository) {

    }


    async createComment(req: Request, res: Response) {

        const user = req.user!
        const userId = req.user!._id.toString();
        const postId = req.params.id;
        const content: CommentInPut = req.body;
        const commentId = await this.commentsService.createComment(user.login, user._id.toString(), content, postId);
        if (commentId.status !== ResultStatus.Created) {
            return res.sendStatus(resultCodeToHttpException(commentId.status))
        }
        const comment = await this.commentsQueryRepository.findByCommentId(commentId.data!, userId);
        if (comment.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(commentId.status))
        }
        return res.status(resultCodeToHttpException(ResultStatus.Created)).send(comment.data);
    }

    async createPost(req: Request, res: Response) {
        const body = req.body;
        const createdPostId = await this.postsService.createPost(body);

        if (!createdPostId.data) {
            return res.sendStatus(resultCodeToHttpException(createdPostId.status));
        }
        const createdPost = await this.postsQueryRepository.findById(createdPostId.data!);
        if (createdPost.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(createdPost.status));
        }
        return res.status(resultCodeToHttpException(ResultStatus.Created)).send(createdPost.data);
    }

    async deletePost(req: Request, res: Response) {
        const postId = req.params.id;
        const result = await this.postsService.delete(postId)
        return res.sendStatus(resultCodeToHttpException(result.status));
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const postId = req.params.id;
        const query: InPutPagination = req.query;
        const comments = await this.commentsQueryRepository.findByPostId(postId, query);
        if (comments.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(comments.status));
        }
        return res.status(resultCodeToHttpException(comments.status)).send(comments.data);
    }

    async getPost(req: Request, res: Response) {
        const postId = req.params.id;
        const foundPost = await this.postsQueryRepository.findById(postId);
        if (foundPost.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(foundPost.status));
        }
        return res.status(resultCodeToHttpException(foundPost.status)).send(foundPost.data);
    }

    async getPostList(req: Request, res: Response) {
        const query: InPutPagination = req.query
        const posts = await this.postsQueryRepository.findAll(query)
        if (posts.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(posts.status))
        }
        return res.status(resultCodeToHttpException(posts.status)).send(posts.data)
    }

    async updatePost(req: Request, res: Response) {
        const postId: string = req.params.id;
        const body: PostInputDto = req.body;
        const result = await this.postsService.update(postId, body);
        return res.sendStatus(resultCodeToHttpException(result.status))
    }
}