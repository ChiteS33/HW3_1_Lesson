import {UserInDb} from "../types/userInDb";
import {ObjectId, WithId} from "mongodb";
import {userCollection} from "../../db/mongo.db";
import {
    PaginationWithSearchLoginTermAndSearchEMailTermForRepo
} from "../../common/types/paginationWithSearchLoginAndEmailForRepo";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {userMapper} from "../routes/mappers/userMapper";
import {UserOutPut} from "../types/userOutPut";
import {OutPutPagination} from "../../common/types/outputPagination";
import {finalUserMapper} from "../routes/mappers/finalUserMapper";
import {valuesMakerWithSearchLoginAndEmail} from "../../common/mapper/valuesMakerWIthLoginAndEmail";
import {
    InPutPaginationWithSearchLoginTermAndSearchEMailTerm
} from "../../common/types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";


export const usersQueryRepository = {

    async findAll(query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm): Promise<ObjectResult<FinalWithPagination<UserOutPut>>> {

        const pagination: PaginationWithSearchLoginTermAndSearchEMailTermForRepo = valuesMakerWithSearchLoginAndEmail(query)

        const skip = (pagination.pageNumber - 1) * pagination.pageSize;
        const limit = pagination.pageSize;
        const sort = {[pagination.sortBy]: pagination.sortDirection}

        const search = {
            $or: [
                {login: {$regex: pagination.searchLoginTerm, $options: "i"}},
                {email: {$regex: pagination.searchEmailTerm, $options: "i"}}
            ]
        }

        const users: WithId<UserInDb>[] = await userCollection.find(search).skip(skip).limit(limit).sort(sort).toArray();

        const totalCount = await userCollection.countDocuments(search);

        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
        }

        const userForFrontend: UserOutPut[] = users.map(userMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: finalUserMapper(userForFrontend, params)
        }


    },
    async findById(userId: string): Promise<ObjectResult<UserOutPut | null>> {

        const user: WithId<UserInDb> | null = await userCollection.findOne({_id: new ObjectId(userId)})
        if (!user) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "User not found",
                extensions: [{
                    field: "User",
                    message: "User not found"
                }],
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: userMapper(user)
        }

    },
}