import jwt from "jsonwebtoken";
import {settings} from "../settings";


export const jwtService = {

    async createJWT(userId: string) {
        return jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '1h'})

    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId
        } catch (error) {
            return null
        }
    },
    async createRefreshToken(userId: string) {
        return jwt.sign({userId}, settings.JWT_REFRESH_TOKEN, {expiresIn: '2h'})
    },

    async verifyRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_TOKEN);
            return result.userId;
        } catch (error: any) {
            console.log('Refresh token verification failed:', error.message);
            return null;
        }
    }


}

