import {UserDocument} from "../../users/routes/users.entity";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDocument | null
        }
    }
}
