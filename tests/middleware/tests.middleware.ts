import debug from "debug";
import express from "express";
import testService from "../services/tests.service";
import shopService from "../../shops/services/shops.service";

const log: debug.IDebugger = debug("app:tests-controller");

class TestsMiddleware {
    async validateTestExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const test = await testService.readById(
            req.params.testId
        );
        if (test) {
            res.locals.test = test;
            next();
        } else {
            res.status(404).send({
                error: `Test ${req.params.testId} not found`,
            });
        }
    }

    async extractTestId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body._id = req.params.testId;
        next();
    }
}

export default new TestsMiddleware();
