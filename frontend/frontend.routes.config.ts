import * as fs from "fs";
import express from "express";

import { CommonRoutesConfig } from "../common/common.routes.config";

export class FrontendRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "FrontendRoutes");
    }

    configureRoutes(): express.Application {
        this.app.use(express.static(`${__dirname}/public`));

        this.app
            .route("/shopinfo/:shopId")
            .get((req: express.Request, res: express.Response) => {
                // Load html and edit hidden shopId field before send to client
                const shopId = req.params.shopId;
                const html = fs.readFileSync(
                    `${__dirname}/public/shopinfo/shopinfo.html`,
                    "utf8"
                );
                const htmlWithShopId = html.replace("put shopId here", shopId);
                res.send(htmlWithShopId);
            });

        this.app
            .route("/testinfo/:testId")
            .get((req: express.Request, res: express.Response) => {
                // Load html and edit hidden testId field before send to client
                const testId = req.params.testId;
                const html = fs.readFileSync(
                    `${__dirname}/public/testinfo/testinfo.html`,
                    "utf8"
                );
                const htmlWithTestId = html.replace("put testId here", testId);
                res.send(htmlWithTestId);
            });

        return this.app;
    }
}
