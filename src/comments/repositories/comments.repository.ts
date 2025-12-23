import {ObjectId} from "mongodb";
import {CommentDocument, CommentModel} from "../routers/comments.entity";


export class CommentsRepository {

    async save(comment: CommentDocument): Promise<string> {
        const savedComment: CommentDocument = await comment.save()
        return savedComment._id.toString();
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id: new ObjectId(id)});
    }

    async delete(id: string): Promise<void> {
        await CommentModel.deleteOne({_id: new ObjectId(id)});
    }


}




