

export type UserInDb = {
        login: string,
        email: string,
        password: string,
        createdAt: Date,
        emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean,
        }
}
