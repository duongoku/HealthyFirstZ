import debug from "debug";
import express from "express";
import examinationsService from "../services/examinations.service";
import ShopsService from "../../shops/services/shops.service";
import UsersService from "../../users/services/users.service";

const log: debug.IDebugger = debug("app:examinations-controller");

class ExaminationsController {
    async listExaminations(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }
        const examinations = await examinationsService.list(limit, page);

        res.status(200).send({ data: examinations });
    }

    async listExaminationsByUser(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Assume user exists because there is a middleware that checks for it
        const user = await UsersService.readById(req.params.userId);

        const shops_managed_by_user = await ShopsService.listByWard(
            user.ward,
            user.permissionFlags,
            999999,
            0
        );

        const examinations = [];
        for (const shop of shops_managed_by_user) {
            const shop_examinations = await examinationsService.listByShopId(
                shop._id,
                999999,
                0
            );
            examinations.push(...shop_examinations);
        }

        res.status(200).send({ data: examinations });
    }

    async listExaminationsByShop(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Assume shop exists because there is a middleware that checks for it
        const shop = await ShopsService.readById(req.params.shopId);
        const examinations = await examinationsService.listByShopId(
            shop._id,
            limit,
            page
        );

        res.status(200).send({ data: examinations });
    }

    async getExaminationById(req: express.Request, res: express.Response) {
        const examination = await examinationsService.readById(req.body._id);
        res.status(200).send(examination);
    }

    async createExamination(req: express.Request, res: express.Response) {
        const examinationId = await examinationsService.create(req.body);
        res.status(201).send({ id: examinationId });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await examinationsService.patchById(req.body._id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await examinationsService.putById(req.body._id, req.body));
        res.status(204).send();
    }

    async removeExamination(req: express.Request, res: express.Response) {
        log(await examinationsService.deleteById(req.body._id));
        res.status(204).send();
    }
}

export default new ExaminationsController();
