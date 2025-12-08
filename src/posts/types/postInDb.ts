import {ObjectId} from "mongodb";

export type PostInDb = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId":  ObjectId,
    "blogName": string,
    "createdAt": string,
};