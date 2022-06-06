export interface PutUserDto {
    _id: string;
    email: string;
    password: string;
    ward: string;
    firstName: string;
    lastName: string;
    permissionFlags: number;
}
