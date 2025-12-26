import {SessionDocument, SessionModel} from "../routes/sessions.entity";
import {injectable} from "inversify";
import "reflect-metadata"



@injectable()
export class SessionsRepository {


    async save(session: SessionDocument): Promise<string> {
        const savedSession = await session.save()
        return savedSession._id.toString();
    }

    async deleteById(deviceId: string): Promise<void> {
        await SessionModel.deleteOne({deviceId: deviceId});
    }

    async deleteAlmostAll(userId: string, deviceId: string): Promise<void> {
        await SessionModel.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        })
    }

    async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<any> {
        const result = await SessionModel.findOne({deviceId, userId});
        if (!result) return null;
        return result._id.toString();
    }


}
