import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {ObjectId} from "mongodb";

export type SessionInDb = {
    userId: ObjectId;
    deviceId: ObjectId;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}

const sessionSchema = new mongoose.Schema<SessionInDb>({
    userId:{ type: ObjectId},
    deviceId:{ type: ObjectId},
    iat:{ type: Date},
    deviceName:{ type: String},
    ip:{ type: String},
    exp:{ type: Date},
})



type SessionModel = Model<SessionInDb>

export type SessionDocument = HydratedDocument<SessionInDb>

export const SessionModel = model<SessionInDb, SessionModel>("Sessions", sessionSchema)