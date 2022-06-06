import ShopsDao from "../daos/shops.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateShopDto } from "../dtos/create.shop.dto";
import { PatchShopDto } from "../dtos/patch.shop.dto";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

class ShopsService implements CRUD {
    async list(limit: number, page: number) {
        return ShopsDao.getShops(limit, page);
    }

    async listByWard(
        ward: string,
        permissionFlags: number,
        limit: number,
        page: number
    ) {
        if (permissionFlags & PermissionFlag.ADMIN_PERMISSION) {
            return ShopsDao.getShops(limit, page);
        }
        return ShopsDao.getShopsByWard(ward, limit, page);
    }

    async create(resource: CreateShopDto) {
        return ShopsDao.addShop(resource);
    }

    async putById(id: string, resource: PatchShopDto) {
        return ShopsDao.updateShopById(id, resource);
    }

    async readById(id: string) {
        return ShopsDao.getShopById(id);
    }

    async deleteById(id: string) {
        return ShopsDao.removeShopById(id);
    }

    async patchById(id: string, resource: PatchShopDto) {
        return ShopsDao.updateShopById(id, resource);
    }
}

export default new ShopsService();
