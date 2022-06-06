import mongooseService from "../../common/services/mongoose.service";
import { CreateShopDto } from "../dtos/create.shop.dto";
import { PatchShopDto } from "../dtos/patch.shop.dto";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class ShopsDao {
    Schema = mongooseService.getMongoose().Schema;
    shopSchema = new this.Schema(
        {
            _id: String,
            name: String,
            address: String,
            ward: String,
            phone: String,
            type: String,
            isValid: Boolean,
            validBefore: Date,
        },
        { id: false }
    );
    Shop = mongooseService.getMongoose().model("Shops", this.shopSchema);

    constructor() {
        log("Created new instance of ShopsDao");
    }

    async addShop(shopFields: CreateShopDto) {
        const shopId = shortid.generate();
        const shop = new this.Shop({
            ...shopFields,
            _id: shopId,
        });
        await shop.save();
        return shopId;
    }

    async getShopById(shopId: string) {
        return this.Shop.findOne({ _id: shopId }).exec();
    }

    async getShopsByWard(ward: string, limit = 25, page = 0) {
        return this.Shop.find({ ward: ward })
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getShops(limit = 25, page = 0) {
        return this.Shop.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateShopById(shopId: string, shopFields: PatchShopDto) {
        const existingShop = await this.Shop.findOneAndUpdate(
            { _id: shopId },
            { $set: shopFields },
            { new: true }
        );

        return existingShop;
    }

    async removeShopById(shopId: string) {
        return this.Shop.deleteOne({ _id: shopId }).exec();
    }
}

export default new ShopsDao();
