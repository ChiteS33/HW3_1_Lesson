import mongoose, {HydratedDocument, model, Model} from "mongoose";


export type SessionInDb = {
    userId: String;
    deviceId: String;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}

const sessionSchema = new mongoose.Schema<SessionInDb>({
    userId:{ type: String},
    deviceId:{ type: String},
    iat:{ type: Date},
    deviceName:{ type: String},
    ip:{ type: String},
    exp:{ type: Date},
})



type SessionModel = Model<SessionInDb>

export type SessionDocument = HydratedDocument<SessionInDb>

export const SessionModel = model<SessionInDb, SessionModel>("Sessions", sessionSchema)