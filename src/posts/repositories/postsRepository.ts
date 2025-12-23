import {ObjectId} from "mongodb";
import {PostDocument, PostModel} from "../routes/posts.entity";


export class PostsRepository {


    async save(post: PostDocument): Promise<string> {
        const savedPost = await post.save()
        return savedPost._id.toString();

    }

    async findById(id: string): Promise<PostDocument | null> {
         return PostModel.findOne({_id: new ObjectId(id)});

    }

    async delete(id: string): Promise<void> {
        await PostModel.deleteOne({_id: new ObjectId(id)});
        return
    }


}