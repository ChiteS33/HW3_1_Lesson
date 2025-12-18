import {devicesCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";


export class SessionsRepository {


    async deleteById(deviceId: string): Promise<void> {
        await devicesCollection.deleteOne({deviceId: new ObjectId(deviceId)});
    }


    async deleteAlmostAll(userId: string, deviceId: any): Promise<void> {
        await devicesCollection.deleteMany({
            userId: new ObjectId(userId),
            deviceId: {$ne: new ObjectId(deviceId)}
        })
    }


    async createSession(info: any): Promise<string> {
        const result = await devicesCollection.insertOne(info);
        return result.insertedId.toString()
    }


}
