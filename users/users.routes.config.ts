import express from "express";
import { body } from "express-validator";

import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "UsersRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                UsersController.listUsers
            )
            .post(
                body("email").isEmail(),
                body("password")
                    .isLength({ min: 15 })
                    .withMessage("Must include password (15+ characters)"),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleware.extractUserId);

        this.app
            .route(`/users/:userId`)
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        this.app.put(`/users/:userId`, [
            body("email").isEmail(),
            body("password")
                .isLength({ min: 15 })
                .withMessage("Must include password (15+ characters)"),
            body("ward").isString(),
            body("firstName").isString(),
            body("lastName").isString(),
            body("permissionFlags").isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.ADMIN_PERMISSION
            ),
            UsersController.put,
        ]);

        this.app.patch(`/users/:userId`, [
            body("email").isEmail(),
            body("password")
                .isLength({ min: 15 })
                .withMessage("Must include password (15+ characters)")
                .optional(),
            body("ward").isString().optional(),
            body("firstName").isString().optional(),
            body("lastName").isString().optional(),
            body("permissionFlags").isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.ADMIN_PERMISSION
            ),
            UsersController.patch,
        ]);

        return this.app;
    }
}
