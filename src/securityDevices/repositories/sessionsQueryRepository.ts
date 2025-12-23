import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {ObjectId} from "mongodb";
import {DeviceOutPut} from "../types/deviceOutPut";
import {SessionDocument, SessionModel} from "../routes/sessions.entity";
import {outPutSessionMapper} from "../routes/mappers/sessionMapper";




export class SessionsQueryRepository {


      async findAllDevicesByUserId(userId: any,): Promise<ObjectResult<DeviceOutPut[] | null>> {
        const currentDate = new Date();
        const result: SessionDocument[] = await SessionModel.find({
            userId: new ObjectId(userId),
            exp: {$gt: currentDate}
        });
        const resultForFront: DeviceOutPut[] = result.map(outPutSessionMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: resultForFront
        }
    }


}



