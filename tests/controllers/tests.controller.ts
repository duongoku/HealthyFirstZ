import debug from "debug";
import express from "express";
import testsService from "../services/tests.service";

const log: debug.IDebugger = debug("app:tests-controller");

class TestsController {
    async listTests(req: express.Request, res: express.Response) {
        let limit = 25;
        let page = 0;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }
        if (req.params.page) {
            page = parseInt(req.params.page);
        }
        const tests = await testsService.list(limit, page);
        res.status(200).send(tests);
    }

    async getTestById(req: express.Request, res: express.Response) {
        const test = await testsService.readById(req.body._id);
        res.status(200).send(test);
    }

    async createTest(req: express.Request, res: express.Response) {
        const testId = await testsService.create(req.body);
        res.status(201).send({ id: testId });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await testsService.patchById(req.body._id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await testsService.putById(req.body._id, req.body));
        res.status(204).send();
    }

    async removeTest(req: express.Request, res: express.Response) {
        log(await testsService.deleteById(req.body._id));
        res.status(204).send();
    }
}

export default new TestsController();
