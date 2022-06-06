import TestsDao from "../daos/tests.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateTestDto } from "../dtos/create.test.dto";
import { PatchTestDto } from "../dtos/patch.test.dto";

class TestsService implements CRUD {
    async list(limit: number, page: number) {
        return TestsDao.getTests(limit, page);
    }

    async create(resource: CreateTestDto) {
        return TestsDao.addTest(resource);
    }

    async putById(id: string, resource: PatchTestDto) {
        return TestsDao.updateTestById(id, resource);
    }

    async readById(id: string) {
        return TestsDao.getTestById(id);
    }

    async deleteById(id: string) {
        return TestsDao.removeTestById(id);
    }

    async patchById(id: string, resource: PatchTestDto) {
        return TestsDao.updateTestById(id, resource);
    }
}

export default new TestsService();
