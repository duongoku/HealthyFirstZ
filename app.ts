// Import environment variables
import dotenv from "dotenv";
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

import * as expressWinston from "express-winston";
import * as http from "http";
import * as winston from "winston";
import cors from "cors";
import debug from "debug";
import express from "express";
import helmet from "helmet";

import { AuthRoutes } from "./auth/auth.routes.config";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { ExaminationsRoutes } from "./examinations/examinations.routes.config";
import { FrontendRoutes } from "./frontend/frontend.routes.config";
import { ShopsRoutes } from "./shops/shops.routes.config";
import { TestsRoutes } from "./tests/tests.routes.config";
import { UsersRoutes } from "./users/users.routes.config";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());

app.use(cors());

app.use(helmet());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false;
    if (typeof global.it === "function") {
        loggerOptions.level = "http";
    }
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new ShopsRoutes(app));
routes.push(new ExaminationsRoutes(app));
routes.push(new TestsRoutes(app));
routes.push(new FrontendRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
});

export default server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});
