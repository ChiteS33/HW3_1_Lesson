import mongoose, {HydratedDocument, model, Model} from "mongoose";

export type BlogInDb = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

const blogSchema = new mongoose.Schema<BlogInDb>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, required: true},
    isMembership: {type: Boolean, required: true},

})

type BlogModel = Model<BlogInDb>

export type BlogDocument = HydratedDocument<BlogInDb>

export const BlogModel = model<BlogInDb, BlogModel>("Blogs", blogSchema);