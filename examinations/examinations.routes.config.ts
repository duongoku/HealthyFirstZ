import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import ExaminationsController from "./controllers/examinations.controller";
import ExaminationsMiddleware from "./middleware/examinations.middleware";
import ShopsMiddleware from "../shops/middleware/shops.middleware";
import UsersMiddleware from "../users/middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

import express from "express";
import { body } from "express-validator";

const statuses = [
    "Kiểm tra tại cơ sở",
    "Lấy mẫu và kiểm định",
    "Kết luận",
    "Xử lý",
];

export class ExaminationsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ExaminationsRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route("/examinations/create")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.SPECIALIST_PERMISSION
                )
            )
            .post(
                body("from").isISO8601(),
                body("to").isISO8601(),
                body("shop_id").isString(),
                body("status").isIn(statuses),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                ExaminationsMiddleware.validateShopExists,
                ExaminationsController.createExamination
            );

        this.app
            .route("/examinations/page/:page?/limit/:limit?")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                )
            )
            .get(ExaminationsController.listExaminations);

        this.app
            .route("/examinations/managedby/:userId/:page?/:limit?")
            .all(
                jwtMiddleware.validJWTNeeded,
                UsersMiddleware.validateUserExists
            )
            .get(ExaminationsController.listExaminationsByUser);

        this.app
            .route("/examinations/of/:shopId/:page?/:limit?")
            .all(
                jwtMiddleware.validJWTNeeded,
                ShopsMiddleware.validateShopExists
            )
            .get(ExaminationsController.listExaminationsByShop);

        this.app.param(
            "examinationId",
            ExaminationsMiddleware.extractExaminationId
        );

        this.app
            .route("/examinations/:examinationId")
            .all(
                jwtMiddleware.validJWTNeeded,
                ExaminationsMiddleware.validateExaminationExists
            )
            .get(ExaminationsController.getExaminationById)
            .patch(ExaminationsController.patch)
            .delete(ExaminationsController.removeExamination);

        return this.app;
    }
}
