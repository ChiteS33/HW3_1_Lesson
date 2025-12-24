import "reflect-metadata"
import {injectable} from "inversify";
import {UserDocument, UserModel} from "../routes/users.entity";


@injectable()
export class UsersRepository {


    async save(user: UserDocument): Promise<string> {

        const savedUser: UserDocument = await user.save();
        return savedUser._id.toString();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findOne({_id: id});

    }

    async delete(id: string): Promise<void> {
        await UserModel.deleteOne({_id: id});
    }

    async findByName(login: string): Promise<UserDocument | null> {
        return UserModel.findOne({login: login});
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({email: email})


    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {

        return UserModel.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}]
        });
    }

    async findByCode(code: string): Promise<UserDocument | null> {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code});
    }

}
