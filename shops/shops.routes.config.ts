import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import ShopsController from "./controllers/shops.controller";
import ShopsMiddleware from "./middleware/shops.middleware";
import UsersMiddleware from "../users/middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

import express from "express";
import { body } from "express-validator";

const shop_types = ["Quán bán thực phẩm", "Cơ sở chế biến thực phẩm"];

export class ShopsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ShopsRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route("/shops/create")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.SPECIALIST_PERMISSION
                )
            )
            .post(
                body("phone").isNumeric(),
                body("type").isIn(shop_types),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                ShopsController.createShop
            );

        this.app
            .route("/shops/page/:page?/limit/:limit?")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                )
            )
            .get(ShopsController.listShops);

        this.app
            .route("/shops/managedby/:userId/:page?/:limit?")
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(ShopsController.listShopsByUser);

        this.app.param("shopId", ShopsMiddleware.extractShopId);

        this.app
            .route("/shops/:shopId/users/:userId")
            .all(
                ShopsMiddleware.validateShopExists,
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                ShopsMiddleware.checkShopManagedByUser
            )
            .get(ShopsController.getShopById)
            .patch(ShopsController.patch)
            .delete(ShopsController.removeShop);

        return this.app;
    }
}
