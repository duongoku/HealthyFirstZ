export interface CreateShopDto {
    name: String;
    address: String;
    ward: String;
    phone: String;
    type: String;
    isValid?: boolean;
    validBefore?: Date;
}
