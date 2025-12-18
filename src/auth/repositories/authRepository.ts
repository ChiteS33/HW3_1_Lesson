import {recoveryPassCollection, userCollection} from "../../db/mongo.db";
import {RecoveryPassInDb} from "../../common/types/recoveryPassInDb";
import {UserInDb} from "../../users/types/userInDb";
import {WithId} from "mongodb";



export class AuthRepository {


    async pushInDb(info: RecoveryPassInDb): Promise<string> {
        const result = await recoveryPassCollection.insertOne((info))
        return result.insertedId.toString()
    }

    async findByRecoveryCode(recoveryCode: string): Promise<string | null> {
        const foundEmail = await recoveryPassCollection.findOne({recoveryCode: recoveryCode})
        if (!foundEmail) {
            return null
        }
        return foundEmail.email
    }

    async changePassword(user: WithId<UserInDb>, newHash: string): Promise<void> {
        console.log(user, newHash)

        await userCollection.updateOne(
            {_id: user._id },
            {
                $set: {
                    password: newHash
                }
            }
        );
    }

    async deleteRecoveryCode(email: any): Promise<void> {
        await recoveryPassCollection.deleteOne({email: email});
    }

}