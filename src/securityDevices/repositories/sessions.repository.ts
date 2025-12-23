import {ObjectId} from "mongodb";
import {SessionDocument, SessionInDb, SessionModel} from "../routes/sessions.entity";
import {injectable} from "inversify/lib/esm";

@injectable()
export class SessionsRepository {


    async save(session: SessionDocument): Promise<string> {
        const savedSession = await session.save()
        return savedSession._id.toString();
    }

    async deleteById(deviceId: string): Promise<void> {
        await SessionModel.deleteOne({deviceId: new ObjectId(deviceId)});
    }

    async deleteAlmostAll(userId: string, deviceId: any): Promise<void> {
        await SessionModel.deleteMany({
            userId: new ObjectId(userId),
            deviceId: {$ne: new ObjectId(deviceId)}
        })
    }


}
