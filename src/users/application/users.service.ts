import {usersRepository} from "../repositories/users.repository";
import {UserInDb} from "../types/userInDb";
import {UserInputDto} from "../types/userInputDto";
import {WithId} from "mongodb";
import {hashServices} from "../../common/service/bcrypt.service";
import {userMapperForRepo} from "../../common/mapper/valuesUserMakerForRepo";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";


export const usersServices = {

    async findUserById(id: string): Promise<WithId<UserInDb> | null> {
        return await usersRepository.findById(id);
    },
    async create(inputInfo: UserInputDto): Promise<ObjectResult<null | string>> {

        const oldUserByEmail = await usersRepository.findByEmail(inputInfo.email);
        if (oldUserByEmail) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Email already in use",
                extensions: [{
                    field: "email",
                    message: "Email already in use"
                }],
                data: null
            }
        }
        const oldUserByLogin = await usersRepository.findByName(inputInfo.login);
        if (oldUserByLogin) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Login already in use",
                extensions: [{
                    field: "login",
                    message: "Login already in use"
                }],
                data: null
            }
        }

        const hash: string = await hashServices.hashMaker(inputInfo.password)
        const newUser: UserInDb = userMapperForRepo(inputInfo, hash);
        const createdUser = await usersRepository.create(newUser)

        return{
            status: ResultStatus.Created,
            extensions: [],
            data: createdUser
        }
    },
    async delete(userId: string): Promise<ObjectResult<null>> {
        const user = await usersServices.findUserById(userId);
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

        await usersRepository.delete(userId);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}


