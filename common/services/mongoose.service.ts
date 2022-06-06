import argon2 from "argon2";
import debug from "debug";
import mongoose from "mongoose";

import UsersDao from "../../users/daos/users.dao";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

const log: debug.IDebugger = debug("app:mongoose-service");

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
    };
    private mongoURI = "uriplaceholder";

    constructor() {
        if (process.env.MONGO_URI === undefined) {
            throw new Error("MONGO_URI is not defined");
        }
        this.mongoURI = process.env.MONGO_URI;
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log("Attempting MongoDB connection (will retry if needed)");
        mongoose
            .connect(this.mongoURI, this.mongooseOptions)
            .then(() => {
                log("MongoDB is connected");
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };

    async clearCollections() {
        const collections = mongoose.connection.collections;

        await Promise.all(
            Object.values(collections).map(async (collection) => {
                await collection.deleteMany({});
            })
        );
    }

    async createAdminUser() {
        const adminUser = {
            email: "admin@admin.com",
            password: "admin",
            ward: "Admin Ward",
            firstName: "Ad",
            lastName: "Min",
        };

        const user = await UsersDao.getUserByEmail(adminUser.email);
        if (user) {
            return adminUser;
        }
        const userId = await UsersDao.addUser({
            ...adminUser,
            password: await argon2.hash(adminUser.password),
        });
        await UsersDao.updateUserById(userId, {
            permissionFlags: PermissionFlag.ALL_PERMISSION,
        });

        return adminUser;
    }
}

export default new MongooseService();
