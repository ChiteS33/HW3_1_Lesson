import {CommentDocument, CommentModel, LikeDocument, LikeModel} from "../routers/comments.entity";
import "reflect-metadata"
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {

    async save(comment: CommentDocument): Promise<string> {
        const savedComment: CommentDocument = await comment.save()
        return savedComment._id.toString();
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id: id});
    }

    async delete(id: string): Promise<void> {
        await CommentModel.deleteOne({_id: id});
    }

    async saveLikeStatus(like: any): Promise<any> {

        const result = await like.save();
        return result._id.toString();
    }

    async findLikeByCommentId(commentId: string, userId: string ): Promise<LikeDocument | null> {
        return LikeModel.findOne({commentId, userId});
    }

    async findLikeInComment(commentId: string, userId: string): Promise<{
        totalCountLike: number;
        totalCountDislike: number;
        userStatus: string
    } | null> {

        const totalCountLike = await LikeModel.countDocuments({commentId: commentId, status: "Like"})
        const totalCountDislike = await LikeModel.countDocuments({commentId: commentId, status: "Dislike"})
        const foundLike: LikeDocument | null = await LikeModel.findOne({userId: userId})
        if(!foundLike) return null;

        return {
            totalCountLike: totalCountLike,
            totalCountDislike: totalCountDislike,
            userStatus: foundLike.status
        }
    }

}




