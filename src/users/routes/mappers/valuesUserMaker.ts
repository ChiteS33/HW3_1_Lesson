import {add} from "date-fns";
import {UserInputDto} from "../../types/userInputDto";
import {UserInDb} from "../../types/userInDb";

export const valuesUserMakerForRepo = (body: UserInputDto, hash: string): UserInDb  =>{
    return {
        login: body.login,
        email: body.email,
        password: hash,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: crypto.randomUUID(),
            expirationDate: add(new Date(), { hours: 1}),
            isConfirmed: false
        }
    }
}