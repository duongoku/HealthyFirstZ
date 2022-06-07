import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto } from "../dtos/create.user.dto";
import { PatchUserDto } from "../dtos/patch.user.dto";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";
import { PutUserDto } from "../dtos/put.user.dto";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;
    userSchema = new this.Schema(
        {
            _id: String,
            email: String,
            password: { type: String, select: false },
            ward: String,
            firstName: String,
            lastName: String,
            permissionFlags: Number,
        },
        { id: false }
    );
    User = mongooseService.getMongoose().model("Users", this.userSchema);

    constructor() {
        log("Created new instance of UsersDao");
    }

    async addUser(userFields: CreateUserDto) {
        const userId = shortid.generate();
        const user = new this.User({
            ...userFields,
            _id: userId,
            // permissionFlags: PermissionFlag.SPECIALIST_PERMISSION,
        });
        await user.save();
        return userId;
    }

    async getUserByEmailWithPassword(email: string) {
        return this.User.findOne({ email: email })
            .select("_id email permissionFlags +password")
            .exec();
    }

    async getUserByEmail(email: string) {
        return this.User.findOne({ email: email }).exec();
    }

    async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).exec();
    }

    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingUser;
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }
}

export default new UsersDao();
