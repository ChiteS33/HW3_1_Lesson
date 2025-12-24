import * as mongoose from "mongoose";
import {HydratedDocument, model, Model} from "mongoose";
import {factory} from "ts-jest/dist/transformers/hoist-jest";

export type UserInDb = {
    login: string,
    email: string,
    password: string,
    createdAt: Date,
    emailConfirmation: emailConfirmationInDb,
}

export type emailConfirmationInDb = {
    confirmationCode: string | null,
    expirationDate: Date,
    isConfirmed: boolean,
}

const emailConfirmationSchema = new mongoose.Schema<emailConfirmationInDb>({
    confirmationCode: {type: String, required: false, default: null},
    expirationDate: {type: Date},
    isConfirmed: {type: Boolean},
})


const userSchema = new mongoose.Schema<UserInDb>({
    login: {type: String, required: true, minLength: 3, maxLength: 10},
    email: {type: String, required: true},
    password: {type: String, required: true, minLength: 6, maxLength: 500},
    createdAt: {type: Date, required: true},
    emailConfirmation: {type: emailConfirmationSchema}
}, {
    versionKey: false,
})

type UserModel = Model<UserInDb>

export type UserDocument = HydratedDocument<UserInDb>

export const UserModel = model<UserInDb, UserModel>("Users", userSchema)