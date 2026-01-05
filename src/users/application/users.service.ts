import "reflect-metadata"
import {inject, injectable} from "inversify";
import {UserInputDto} from "../types/userInputDto";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {HashService} from "../../common/service/bcrypt.service";
import {UsersRepository} from "../repositories/users.repository";
import {UserDocument, UserModel} from "../routes/users.entity";


@injectable()
export class UsersService {

    constructor(@inject(HashService) public hashService: HashService,
                @inject(UsersRepository) public usersRepository: UsersRepository) {
    }


    async findUserById(id: string): Promise<ObjectResult<UserDocument | null>> {
        const foundUser: UserDocument | null = await this.usersRepository.findById(id);
        if (!foundUser) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "User is not found",
                extensions: [{
                    field: "UserId",
                    message: "User is not found"
                }],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: foundUser
        }
    }

    async createUser(inputInfo: UserInputDto): Promise<ObjectResult<null | string>> {
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


        const newUser = UserModel.createUserBySa({...inputInfo, hash})
        const createdUserId = await this.usersRepository.save(newUser);
        return {
            status: ResultStatus.Created,
            extensions: [],
            data: createdUserId
        }
    }

    async deleteUser(userId: string): Promise<ObjectResult<null>> {
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

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return await this.usersRepository.findByEmail(email);
    }
}


