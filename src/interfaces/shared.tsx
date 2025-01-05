interface IBase {
    id: string
    createdAt: string
    updatedAt: string
}

export interface IUsersDetails extends IBase {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: string
}