import {UserInputDto} from "../../users/types/userInputDto";
import {UserInDb} from "../../users/types/userInDb";

export const userMapperForRepo = (user: UserInputDto, hash: string): UserInDb => {
    return {
        login: user.login,
        password: hash,
        email: user.email,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: "",
            expirationDate: new Date(),
            isConfirmed: true,
        }
    }
}