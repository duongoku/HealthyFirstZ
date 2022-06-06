import debug from "debug";
import express from "express";

import shopsService from "../services/shops.service";
import usersService from "../../users/services/users.service";

const log: debug.IDebugger = debug("app:shops-controller");

class ShopsController {
    async listShops(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }
        const shops = await shopsService.list(limit, page);
        res.status(200).send({ data: shops });
    }

    async listShopsByUser(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Assume user exists because there is a middleware that checks for it
        const user = await usersService.readById(req.params.userId);
        const shops = await shopsService.listByWard(
            user.ward,
            user.permissionFlags,
            limit,
            page
        );
        res.status(200).send({ data: shops });
    }

    async getShopById(req: express.Request, res: express.Response) {
        const shop = await shopsService.readById(req.body._id);
        res.status(200).send(shop);
    }

    async createShop(req: express.Request, res: express.Response) {
        const shopId = await shopsService.create(req.body);
        res.status(201).send({ id: shopId });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await shopsService.patchById(req.body._id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await shopsService.putById(req.body._id, req.body));
        res.status(204).send();
    }

    async removeShop(req: express.Request, res: express.Response) {
        log(await shopsService.deleteById(req.body._id));
        res.status(204).send();
    }
}

export default new ShopsController();
