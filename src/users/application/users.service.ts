import {UserInDb} from "../types/userInDb";
import {UserInputDto} from "../types/userInputDto";
import {WithId} from "mongodb";
import {userMapperForRepo} from "../../common/mapper/valuesUserMakerForRepo";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {HashService} from "../../common/service/bcrypt.service";
import {UsersRepository} from "../repositories/users.repository";


export class UsersService {

    hashService: HashService;
    usersRepository: UsersRepository;

    constructor(hashService: HashService, usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
        this.hashService = hashService;

    }

    async findUserById(id: string): Promise<WithId<UserInDb> | null> {
        return await this.usersRepository.findById(id);
    }

    async create(inputInfo: UserInputDto): Promise<ObjectResult<null | string>> {
        const oldUserByEmail = await this.usersRepository.findByEmail(inputInfo.email);
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
        const oldUserByLogin = await this.usersRepository.findByName(inputInfo.login);
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
        const hash: string = await this.hashService.hashMaker(inputInfo.password)
        const newUser: UserInDb = userMapperForRepo(inputInfo, hash);
        const createdUser = await this.usersRepository.create(newUser)
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdUser
        }
    }

    async delete(userId: string): Promise<ObjectResult<null>> {
        const user = await this.findUserById(userId);
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
        await this.usersRepository.delete(userId);
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }

    async findUserByEmail(email: string): Promise<WithId<UserInDb> | null> {
        return await this.usersRepository.findByEmail(email);
    }
}


