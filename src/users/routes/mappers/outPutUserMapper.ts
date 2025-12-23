import {UserOutPut} from "../../types/userOutPut";
import {UserDocument} from "../users.entity";


export const outPutUserMapper = (user: UserDocument): UserOutPut => {

    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    }

}