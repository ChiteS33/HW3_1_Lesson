import {WithId} from "mongodb";
import {UserInDb} from "../../types/userInDb";
import {UserOutPut} from "../../types/userOutPut";


export const userMapper = (user: WithId<UserInDb>): UserOutPut => {

    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    }

}