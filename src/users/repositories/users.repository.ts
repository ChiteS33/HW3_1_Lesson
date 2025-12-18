import {UserInDb} from "../types/userInDb";
import {userCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";


export class UsersRepository {

    async findById(id: string): Promise<WithId<UserInDb> | null> {
        const foundUser: WithId<UserInDb> | null = await userCollection.findOne({_id: new ObjectId(id)})
        if (!foundUser) return null
        return foundUser
    }

    async create(newUser: UserInDb): Promise<string> {
        const insertResult = await userCollection.insertOne((newUser))
        return insertResult.insertedId.toString()

    }

    async delete(id: string): Promise<void> {
        await userCollection.deleteOne({_id: new ObjectId(id)});
    }

    async findByName(login: string): Promise<UserInDb | null> {
        return userCollection.findOne({login: login})
    }

    async findByEmail(email: string): Promise<WithId<UserInDb> | null> {
        return userCollection.findOne({email: email})
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserInDb> | null> {
        return userCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}]
        })
    }

    async updateConfirmation(_id: ObjectId): Promise<void> {
        await userCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
    }

    async findByCode(code: string): Promise<WithId<UserInDb> | null> {
        return await userCollection.findOne({"emailConfirmation.confirmationCode": code})
    }

    async updateConfirmationCode(code: string, date: Date, id: string): Promise<void> {
        await userCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                'emailConfirmation.confirmationCode': code,
                "emailConfirmation.expirationDate": date
            }
        })
    }


}
