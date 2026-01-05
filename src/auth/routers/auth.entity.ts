import mongoose, {HydratedDocument, model, Model} from "mongoose";




export type RequestCounter = {
    ip: string;
    url: string;
    time: Date;
}

const requestCounterShema = new mongoose.Schema<RequestCounter>({
    ip: {type: String},
    url: {type: String},
    time: {type: Date},
})

type RequestCounterModel = Model<RequestCounter>

export type RequestCounterDocument = HydratedDocument<RequestCounter>

export const RequestCounterModel = model<RequestCounter, RequestCounterModel>("RequestCounter", requestCounterShema)