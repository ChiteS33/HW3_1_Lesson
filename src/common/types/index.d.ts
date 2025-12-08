import {UserInDb} from "../../users/types/userInDb";
import {WithId} from "mongodb";

declare global {
    declare namespace Express {
        export interface Request {
            user: WithId<UserInDb> | null
        }
    }
}
