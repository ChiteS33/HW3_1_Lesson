import {BlogDocument, BlogModel} from "../routers/blogs.entity";
import "reflect-metadata"
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {


    async save(blog: BlogDocument): Promise<string> {
        const savedBlog = await blog.save()
        return savedBlog._id.toString();
    }

    async findById(id: string): Promise<BlogDocument | null> {
        const foundBlog: BlogDocument | null = await BlogModel.findOne({_id: id});
        if (!foundBlog) return null
        return foundBlog
    }

    async delete(id: string): Promise<void> {
        await BlogModel.deleteOne({_id: id});
    }


}