import ExaminationsDao from "../daos/examinations.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateExaminationDto } from "../dtos/create.examination.dto";
import { PatchExaminationDto } from "../dtos/patch.examination.dto";

class ExaminationsService implements CRUD {
    async list(limit: number, page: number) {
        return ExaminationsDao.getExaminations(limit, page);
    }

    async listByShopId(shopId: string, limit: number, page: number) {
        return ExaminationsDao.getExaminationsByShopId(shopId, limit, page);
    }

    async create(resource: CreateExaminationDto) {
        return ExaminationsDao.addExamination(resource);
    }

    async putById(id: string, resource: PatchExaminationDto) {
        return ExaminationsDao.updateExaminationById(id, resource);
    }

    async readById(id: string) {
        return ExaminationsDao.getExaminationById(id);
    }

    async deleteById(id: string) {
        return ExaminationsDao.removeExaminationById(id);
    }

    async patchById(id: string, resource: PatchExaminationDto) {
        return ExaminationsDao.updateExaminationById(id, resource);
    }
}

export default new ExaminationsService();
