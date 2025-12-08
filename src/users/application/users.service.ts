import {usersRepository} from "../repositories/users.repository";
import {UserInDb} from "../types/userInDb";
import {UserInputDto} from "../types/userInputDto";
import {WithId} from "mongodb";
import {hashServices} from "../../common/service/bcrypt.service";
import {userMapperForRepo} from "../../common/mapper/valuesUserMakerForRepo";


export const usersServices = {

    async findUserById(id: string): Promise<WithId<UserInDb> | null> {
        return await usersRepository.findById(id);
    },
    async create(inputInfo: UserInputDto): Promise<false | string | null> {

        const oldUserByEmail = await usersRepository.findByEmail(inputInfo.email);
        if (oldUserByEmail) {
            return null
        }
        const oldUserByLogin = await usersRepository.findByName(inputInfo.login);
        if (oldUserByLogin) {
            return false
        }
        const hash:string = await hashServices.hashMaker(inputInfo.password)
        const newUser: UserInDb = userMapperForRepo(inputInfo, hash);

        return await usersRepository.create(newUser)
    },
    async delete(id: string): Promise<void> {
        return await usersRepository.delete(id);
    }
}


