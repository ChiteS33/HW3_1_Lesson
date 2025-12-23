import mongoose, {HydratedDocument, model, Model} from "mongoose";

export type RecoveryPassInDb = {
    email: string,
    recoveryCode: string
}

const recoveryPassSchema = new mongoose.Schema<RecoveryPassInDb>({
    email: {type: String, required: true},
    recoveryCode: {type: String, required: true},
})

type RecoveryPassModel = Model<RecoveryPassInDb>

export type RecoveryPassDocument = HydratedDocument<RecoveryPassInDb>

export const RecoveryPassModel = model<RecoveryPassInDb, RecoveryPassModel>("RecoveryPass", recoveryPassSchema)