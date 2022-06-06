import mongooseService from "../../common/services/mongoose.service";
import { CreateTestDto } from "../dtos/create.test.dto";
import { PatchTestDto } from "../dtos/patch.test.dto";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class TestsDao {
    Schema = mongooseService.getMongoose().Schema;
    testSchema = new this.Schema(
        {
            _id: String,
            taken: Date,
            status: String,
            result: String,
            processing_unit: String,
            result_date: Date,
        },
        { id: false }
    );
    Test = mongooseService.getMongoose().model("Tests", this.testSchema);

    constructor() {
        log("Created new instance of TestsDao");
    }

    async addTest(testFields: CreateTestDto) {
        const testId = shortid.generate();
        const test = new this.Test({
            ...testFields,
            _id: testId,
        });
        await test.save();
        return testId;
    }

    async getTestById(testId: string) {
        return this.Test.findOne({ _id: testId }).exec();
    }

    async getTests(limit = 25, page = 0) {
        return this.Test.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateTestById(testId: string, testFields: PatchTestDto) {
        const existingTest = await this.Test.findOneAndUpdate(
            { _id: testId },
            { $set: testFields },
            { new: true }
        );

        return existingTest;
    }

    async removeTestById(testId: string) {
        return this.Test.deleteOne({ _id: testId }).exec();
    }
}

export default new TestsDao();
