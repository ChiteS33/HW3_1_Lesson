import {commentCollection} from "../../db/mongo.db";
import {ObjectId, WithId,} from "mongodb";
import {CommentInDb} from "../types/commentInDb";
import {CommentInPut} from "../types/commentInPut";


export class CommentsRepository {

    async create(newComments: CommentInDb): Promise<string> {
        const comment = await commentCollection.insertOne((newComments))
        return comment.insertedId.toString()
    }

    async findById(id: string): Promise<WithId<CommentInDb> | null> {
        return await commentCollection.findOne({_id: new ObjectId(id)});
    }

    async update(id: string, body: CommentInPut): Promise<void> {
        await commentCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    content: body.content,
                }
            }
        );
        return
    }

    async delete(id: string): Promise<void> {
        await commentCollection.deleteOne({_id: new ObjectId(id)});
    }


}




