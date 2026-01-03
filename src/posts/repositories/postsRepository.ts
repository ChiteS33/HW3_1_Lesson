import {LikeDocumentForPost, LikeModelForPost, PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"
import {injectable} from "inversify";


@injectable()
export class PostsRepository {


    async save(post: PostDocument): Promise<string> {
        const savedPost: PostDocument = await post.save()
        return savedPost._id.toString();
    }

    async findById(id: string): Promise<PostDocument | null> {
        return PostModel.findOne({_id: id});
    }

    async delete(id: string): Promise<void> {
        await PostModel.deleteOne({_id: id});
        return
    }

    async saveLike(like: LikeDocumentForPost): Promise<string> {
        const result = await like.save();
        return result._id.toString();
    }

    async findLikeByPostId(postId: string, userId: string): Promise<LikeDocumentForPost | null> {
        return LikeModelForPost.findOne({postId, userId});
    }

}