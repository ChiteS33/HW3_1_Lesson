import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {devicesCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";
import {deviceFinalMake} from "../routes/mappers/deviceFinalMapper";
import {DeviceOutPut} from "../types/deviceOutPut";




export const devicesQueryRepository = {


    async findAllDevicesByUserId(userId: any,): Promise<ObjectResult<DeviceOutPut[] | null>> {

        const currentDate = new Date();

        const result = await devicesCollection.find({
            userId: new ObjectId(userId),
            exp: {$gt: currentDate}
        }).toArray();

        const resultForFront: DeviceOutPut[] = result.map(deviceFinalMake)


        return {
            status: ResultStatus.Success,
            extensions: [],
            data: resultForFront
        }
    }
}


// Надо найти все device, если exp > нынешней даты, одного конкретного Юзера


