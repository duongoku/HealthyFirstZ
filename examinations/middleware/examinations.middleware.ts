import debug from "debug";
import express from "express";
import examinationService from "../services/examinations.service";
import shopService from "../../shops/services/shops.service";

const log: debug.IDebugger = debug("app:examinations-controller");

class ExaminationsMiddleware {
    async validateExaminationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const examination = await examinationService.readById(
            req.params.examinationId
        );
        if (examination) {
            res.locals.examination = examination;
            next();
        } else {
            res.status(404).send({
                error: `Examination ${req.params.examinationId} not found`,
            });
        }
    }

    async extractExaminationId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body._id = req.params.examinationId;
        next();
    }

    async validateShopExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const shop = await shopService.readById(req.body.shop_id);
        if (shop) {
            res.locals.shop = shop;
            next();
        } else {
            res.status(404).send({
                error: `Shop ${req.params.shopId} not found`,
            });
        }
    }
}

export default new ExaminationsMiddleware();
