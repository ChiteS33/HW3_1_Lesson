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






export type RequestCounter = {
    ip: string;
    url: string;
    time: Date;
}

const requestCounterShema = new mongoose.Schema<RequestCounter>({
    ip: {type: String},
    url: {type: String},
    time: {type: Date},
})

type RequestCounterModel = Model<RequestCounter>

export type RequestCounterDocument = HydratedDocument<RequestCounter>

export const RequestCounterModel = model<RequestCounter, RequestCounterModel>("RequestCounter", requestCounterShema)