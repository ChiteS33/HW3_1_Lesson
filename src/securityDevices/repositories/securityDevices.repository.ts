import {devicesCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";


export const devicesRepository = {


    async deleteById(userId: string): Promise<void> {

        await devicesCollection.deleteOne({userId: new ObjectId(userId)});
    },
    async deleteAlmostAll(userId: string, deviceName: any): Promise<void> {

        await devicesCollection.deleteMany({
            userId: new ObjectId(userId),
            deviceName: {$ne: deviceName}
        })
    },
    async createSession(info: any): Promise<string> {

        const result = await devicesCollection.insertOne(info);
        return result.insertedId.toString()
    }

}
