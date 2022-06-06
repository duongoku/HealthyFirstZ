export interface CreateUserDto {
    email: string;
    password: string;
    ward: string;
    firstName?: string;
    lastName?: string;
    permissionFlags?: number;
}
