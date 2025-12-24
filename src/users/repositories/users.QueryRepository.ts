import "reflect-metadata"
import {injectable} from "inversify";
import {
    PaginationWithSearchLoginTermAndSearchEMailTermForRepo
} from "../../common/types/paginationWithSearchLoginAndEmailForRepo";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {outPutUserMapper} from "../routes/mappers/outPutUserMapper";
import {UserOutPut} from "../types/userOutPut";
import {OutPutPagination} from "../../common/types/outputPagination";
import {outPutPaginationUserMapper} from "../routes/mappers/outPutPaginationUserMapper";
import {valuesMakerWithSearchLoginAndEmail} from "../../common/mapper/valuesMakerWIthLoginAndEmail";
import {
    InPutPaginationWithSearchLoginTermAndSearchEMailTerm
} from "../../common/types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {UserDocument, UserModel} from "../routes/users.entity";




@injectable()
export class UsersQueryRepository {

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
        const users: UserDocument[] = await UserModel.find(search).skip(skip).limit(limit).sort(sort);
        const totalCount = await UserModel.countDocuments(search);
        const params: OutPutPagination = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
        }
        const userForFrontend: UserOutPut[] = users.map(outPutUserMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationUserMapper(userForFrontend, params)
        }
    }

    async findById(userId: string): Promise<ObjectResult<UserOutPut | null>> {
        const user: UserDocument | null = await UserModel.findOne({_id: userId})
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
            data: outPutUserMapper(user)
        }
    }


}