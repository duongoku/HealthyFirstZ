import { CreateShopDto } from "./create.shop.dto";

export interface PatchShopDto extends Partial<CreateShopDto> {
    _id: String;
}
