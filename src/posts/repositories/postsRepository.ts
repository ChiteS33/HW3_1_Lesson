import {PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"
import {injectable} from "inversify";


@injectable()
export class PostsRepository {


    async save(post: PostDocument): Promise<string> {
        console.log(post);
        const savedPost: PostDocument = await post.save()
        console.log("adsadasdSDSADA")
        return savedPost._id.toString();
    }

    async findById(id: string): Promise<PostDocument | null> {
        return PostModel.findOne({_id: id});
    }

    async delete(id: string): Promise<void> {
        await PostModel.deleteOne({_id: id});
        return
    }


}