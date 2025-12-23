import jwt from "jsonwebtoken";
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {jwtDecode} from "jwt-decode";
import {Payload} from "../types/payload";
import {injectable} from "inversify";

@injectable()
export class JwtService {


     async createJWT(userId: string): Promise<string> {
        return jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '1h'})
    }


     async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }


     async createRefreshToken(userId: string, deviceId: string = new ObjectId().toString()): Promise<string> {
        const payload = {userId: userId, deviceId: deviceId};
        return jwt.sign(payload, settings.JWT_REFRESH_TOKEN, {expiresIn: '2h'})
    }


     async verifyRefreshToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_TOKEN);
            return result.userId;
        } catch (error: any) {
            console.log('Refresh token verification failed:', error.message);
            return null;
        }
    }


     async decodeJWT(token: string):Promise<Payload> {
        return jwtDecode(token)
    }

}

