import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import TestsController from "./controllers/tests.controller";
import TestsMiddleware from "./middleware/tests.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

import express from "express";
import { body } from "express-validator";

const statuses = ["Đang xử lý", "Đã xử lý xong", "Đã bị hủy"];
const results = ["Đạt", "Không đạt"];

export class TestsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "TestsRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route("/tests/create")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.SPECIALIST_PERMISSION
                )
            )
            .post(
                body("taken").isDate(),
                body("result_date").isDate(),
                body("processing_unit").isString(),
                body("result").isIn(results),
                body("status").isIn(statuses),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                TestsController.createTest
            );

        this.app
            .route("/tests/page/:page?/limit/:limit?")
            .all(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.SPECIALIST_PERMISSION
                )
            )
            .get(TestsController.listTests);

        this.app.param("testId", TestsMiddleware.extractTestId);

        this.app
            .route("/tests/:testId")
            .all(
                jwtMiddleware.validJWTNeeded,
                TestsMiddleware.validateTestExists
            )
            .get(TestsController.getTestById)
            .patch(TestsController.patch)
            .delete(TestsController.removeTest);

        return this.app;
    }
}
