import {injectable} from "inversify";
import {RecoveryPassDocument, RecoveryPassModel} from "../routers/auth.entity";
import "reflect-metadata"




@injectable()
export class AuthRepository {


    async save(recoveryPass: RecoveryPassDocument): Promise<string> {
        const savedRecoveryPass = await recoveryPass.save();
        return savedRecoveryPass._id.toString();
    }

    async findByRecoveryCode(recoveryCode: string): Promise<string | null> {
        const foundEmail: RecoveryPassDocument | null = await RecoveryPassModel.findOne({recoveryCode: recoveryCode})
        if (!foundEmail) {
            return null
        }
        return foundEmail.email
    }

    async changePassword(userId: string, newHash: string): Promise<void> {
        await RecoveryPassModel.updateOne(
            {_id: userId},
            {
                $set: {
                    password: newHash
                }
            }
        );
    }

    async deleteRecoveryCode(email: any): Promise<void> {
        await RecoveryPassModel.deleteOne({email: email});
    }

}