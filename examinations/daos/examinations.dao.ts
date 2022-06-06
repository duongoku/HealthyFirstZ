import mongooseService from "../../common/services/mongoose.service";
import { CreateExaminationDto } from "../dtos/create.examination.dto";
import { PatchExaminationDto } from "../dtos/patch.examination.dto";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class ExaminationsDao {
    Schema = mongooseService.getMongoose().Schema;
    examinationSchema = new this.Schema(
        {
            _id: String,
            from: Date,
            to: Date,
            shop_id: String,
            status: String,
            test_id: String,
        },
        { id: false }
    );
    Examination = mongooseService
        .getMongoose()
        .model("Examinations", this.examinationSchema);

    constructor() {
        log("Created new instance of ExaminationsDao");
    }

    async addExamination(examinationFields: CreateExaminationDto) {
        const examinationId = shortid.generate();
        const examination = new this.Examination({
            ...examinationFields,
            _id: examinationId,
        });
        await examination.save();
        return examinationId;
    }

    async getExaminationById(examinationId: string) {
        return this.Examination.findOne({ _id: examinationId }).exec();
    }

    async getExaminations(limit = 25, page = 0) {
        return this.Examination.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getExaminationsByShopId(shopId: string, limit = 25, page = 0) {
        return this.Examination.find({ shop_id: shopId })
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateExaminationById(
        examinationId: string,
        examinationFields: PatchExaminationDto
    ) {
        const existingExamination = await this.Examination.findOneAndUpdate(
            { _id: examinationId },
            { $set: examinationFields },
            { new: true }
        );

        return existingExamination;
    }

    async removeExaminationById(examinationId: string) {
        return this.Examination.deleteOne({ _id: examinationId }).exec();
    }
}

export default new ExaminationsDao();
