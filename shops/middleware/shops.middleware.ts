import debug from "debug";
import express from "express";

import shopService from "../services/shops.service";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

const log: debug.IDebugger = debug("app:shops-controller");

class ShopsMiddleware {
    async validateShopExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const shop = await shopService.readById(req.params.shopId);
        if (shop) {
            res.locals.shop = shop;
            next();
        } else {
            res.status(404).send({
                error: `Shop ${req.params.shopId} not found`,
            });
        }
    }

    async extractShopId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body._id = req.params.shopId;
        next();
    }

    async checkShopManagedByUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const shop = res.locals.shop;
        const user = res.locals.user;
        if (
            shop.ward === user.ward ||
            user.permissionFlags & PermissionFlag.ADMIN_PERMISSION
        ) {
            next();
        } else {
            res.status(403).send({
                error: "You are not allowed to do this action",
            });
        }
    }
}

export default new ShopsMiddleware();
