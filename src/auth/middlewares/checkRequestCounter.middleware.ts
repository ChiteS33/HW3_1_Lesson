import {NextFunction, Request, Response} from "express";
import {RequestCounter, RequestCounterModel} from "../routers/auth.entity";


export const checkRequestCounterMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip!
    const url = req.originalUrl
    const iat = new Date()
    const tenSeconds = new Date(iat.getTime() - 10000)

    const resultForCollection = (ip: string, url: string, iat: Date): RequestCounter => {
        return {
            ip: ip,
            url: url,
            time: iat,
        }
    }
    const info = resultForCollection(ip, url, iat)
    const foundSessions = await RequestCounterModel.find(
        {
            ip: ip,
            url: url,
            time: {$gte: tenSeconds}
        })
    await RequestCounterModel.insertOne(info)
    if (foundSessions.length >= 5) {
        res.status(429).send("Too much requests per 10s")
        return
    }
    next()
}

