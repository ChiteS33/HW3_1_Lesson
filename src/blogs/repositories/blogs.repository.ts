import {BlogInDb} from "../types/blogInDb";
import {blogCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {BlogInputDto} from "../types/blogInPutDto";


export class BlogsRepository {


    async findById(id: string): Promise<WithId<BlogInDb> | null> {
        const foundBlog: WithId<BlogInDb> | null = await blogCollection.findOne({_id: new ObjectId(id)});
        if (!foundBlog) return null
        return foundBlog
    }

    async create(newBlog: BlogInDb): Promise<string> {
        const insertResult = await blogCollection.insertOne((newBlog))
        return insertResult.insertedId.toString()
    }

    async update(id: string, newBlog: BlogInputDto): Promise<void> {
        await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name: newBlog.name,
                    description: newBlog.description,
                    websiteUrl: newBlog.websiteUrl,
                }
            }
        );
    }

    async delete(id: string): Promise<void> {
        await blogCollection.deleteOne({_id: new ObjectId(id)});
    }


}