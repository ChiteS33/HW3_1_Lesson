import {RecoveryPassInDb} from "../../auth/routers/auth.entity";


export const recoveryMapper = (email: string, recoveryCode: string): RecoveryPassInDb => {
    return {
        email: email,
        recoveryCode: recoveryCode
    }
}