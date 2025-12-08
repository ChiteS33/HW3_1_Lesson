import {PostInputDto} from "../types/post-input.dto";
import {postCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {PostInDb} from "../types/postInDb";


export const postRepository = {


    async findById(id: string): Promise<WithId<PostInDb> | null> {

        return await postCollection.findOne({_id: new ObjectId(id)});
    },
    async create(post: PostInDb): Promise<string> {

        const createdPost = await postCollection.insertOne(post)
        return createdPost.insertedId.toString()

    },
    async update(id: string, newPost: PostInputDto): Promise<string> {

        await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: new ObjectId(newPost.blogId)
                }
            }
        );
        return id
    },
    async delete(id: string): Promise<void> {
        await postCollection.deleteOne({_id: new ObjectId(id)});
        return
    },


};