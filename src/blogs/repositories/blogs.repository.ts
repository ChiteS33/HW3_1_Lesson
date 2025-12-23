import {ObjectId} from "mongodb";
import {BlogDocument, BlogModel} from "../routers/blogs.entity";


export class BlogsRepository {


    async save(blog: BlogDocument): Promise<string> {
        const savedBlog = await blog.save()
        return savedBlog._id.toString();
    }

    async findById(id: string): Promise<BlogDocument | null> {
        const foundBlog: BlogDocument | null = await BlogModel.findOne({_id: new ObjectId(id)});
        if (!foundBlog) return null
        return foundBlog
    }

    async delete(id: string): Promise<void> {
        await BlogModel.deleteOne({_id: new ObjectId(id)});
    }


}