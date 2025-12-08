import {commentsRepository} from "../repositories/comments.repository";
import {CommentInPut} from "../types/commentInPut";
import {UserInDb} from "../../users/types/userInDb";
import {WithId} from "mongodb";
import {commentsValueMaker} from "../routers/mappers/commentsMapperForRepo";
import {CommentInDb} from "../types/commentInDb";


export const commentsServices = {

    async create(user: WithId<UserInDb>, body: CommentInPut, postId: string): Promise<string> {

        const newComment: CommentInDb = commentsValueMaker(postId, body, user)
        return await commentsRepository.create(newComment)

    },
    async update(id: string, body: CommentInPut): Promise<void | null> {
        return await commentsRepository.update(id, body);
    },
    async delete(id: string): Promise<void | null> {
        return await commentsRepository.delete(id);
    }

}
