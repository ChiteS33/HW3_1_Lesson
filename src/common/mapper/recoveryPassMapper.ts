import {RecoveryPassInDb} from "../types/recoveryPassInDb";

export const recoveryMapper = (email: string, recoveryCode: string): RecoveryPassInDb => {
    return {
        email: email,
        recoveryCode: recoveryCode
    }
}