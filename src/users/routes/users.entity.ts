import * as mongoose from "mongoose";
import {HydratedDocument, model, Model} from "mongoose";
import {add} from "date-fns";

export type UserInDb = {
    login: string,
    email: string,
    password: string,
    createdAt: Date,
    emailConfirmation: emailConfirmationInDb,
    recoveryData: RecoveryData
}

export type emailConfirmationInDb = {
    confirmationCode: string | null,
    expirationDate: Date,
    isConfirmed: boolean,
}

export type RecoveryData = {
    recoveryCode: string  | null,
}

type UserStatics = typeof UserEntity

interface UserMethods {
    changePass(hash: string): void
    confirmationCode(code: string): void
}


const emailConfirmationSchema = new mongoose.Schema<emailConfirmationInDb>({
    confirmationCode: {type: String, required: false, default: null},
    expirationDate: {type: Date},
    isConfirmed: {type: Boolean},
})

const recoveryDataSchema = new mongoose.Schema({
    recoveryCode: {type: String, required: false, default: null},
})


const userSchema = new mongoose.Schema<UserInDb>({
    login: {type: String, required: true, minLength: 3, maxLength: 10},
    email: {type: String, required: true},
    password: {type: String, required: true, minLength: 6, maxLength: 500},
    createdAt: {type: Date, required: true},
    recoveryData:{type:recoveryDataSchema},
    emailConfirmation: {type: emailConfirmationSchema}
}, {
    versionKey: false,
})


class UserEntity {
    private constructor(
        public login: string,
        public email: string,
        public password: string,
        public createdAt: Date,
        public emailConfirmation: emailConfirmationInDb,
        public recoveryData: RecoveryData
    ) {
    }

    static createUserBySa(dto:{login:string, email:string, hash:string}): UserDocument {
        const emailConf = {
            confirmationCode: null,
            expirationDate: new Date(),
            isConfirmed: true
        }
        const user = new UserModel()
        user.login = dto.login
        user.email = dto.email
        user.password = dto.hash
        user.createdAt = new Date()
        user.emailConfirmation = emailConf
        user.recoveryData = {
            recoveryCode: null,
        }

        return user
    }

    static createUser(dto:{login:string, email:string, hash:string}): UserDocument{
        const emailConf = {
            confirmationCode: crypto.randomUUID(),
            expirationDate: add(new Date(), {hours: 1}),
            isConfirmed: false
        }
        const user = new UserModel()
        user.login = dto.login
        user.email = dto.email
        user.password = dto.hash
        user.createdAt = new Date()
        user.emailConfirmation = emailConf
        user.recoveryData = {
            recoveryCode: null,
        }
        return user
    }



    changePass(hash: string){
        this.password = hash
        this.recoveryData.recoveryCode = null
    }

    confirmationCode(code: string){
        if(code !== this.emailConfirmation.confirmationCode){
            throw new Error("SOme SHit")
        }
        this.emailConfirmation.isConfirmed = true
    }



}

userSchema.loadClass(UserEntity);

type UserModel = Model<UserInDb, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<UserInDb, UserMethods>

export const UserModel = model<UserInDb, UserModel>("Users", userSchema)


