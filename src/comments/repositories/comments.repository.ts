import {commentCollection} from "../../db/mongo.db";
import {ObjectId, WithId,} from "mongodb";
import {CommentInDb} from "../types/commentInDb";
import {CommentInPut} from "../types/commentInPut";


export const commentsRepository = {

    async create(newComments: CommentInDb): Promise<string> {
        const comment = await commentCollection.insertOne((newComments))
        return comment.insertedId.toString()
    },

    async findById(id: string): Promise<WithId<CommentInDb> | null> {

        const foundComment: WithId<CommentInDb> | null = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!foundComment) return null

        return foundComment
    },
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
    },
    async delete(id: string): Promise<void> {
        await commentCollection.deleteOne({_id: new ObjectId(id)});
    }

}




