import {blackListCollection} from "../../db/mongo.db";



export const authRepository = {


    async pushTokenInDb(token: string, time: number): Promise<void> {
        await blackListCollection.insertOne({
            refreshToken: token,
            expiresIn: time
        })
        return
    },

    async findTokenInBlackList(token: string): Promise<any> {
        return await blackListCollection.findOne({refreshToken: token})
    },

}


