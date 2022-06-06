import supertest from "supertest";
import { expect } from "chai";
import shortid from "shortid";
import mongoose from "mongoose";

import app from "../../app";
import MongooseService from "../../common/services/mongoose.service";

let firstUserIdTest = "";
const firstUserBody = {
    email: `rick.astley.${shortid.generate()}@gmail.com`,
    password: "suPerS3cretpaZZw0rd",
};

let firstShopIdTest = "";
const firstShopBody = {
    name: "First Shop",
    address: "First Address",
    ward: `${shortid.generate()} Sant'Antonio`,
    phone: "0987654321",
    type: "Quán bán thực phẩm",
};

let firstExaminationIdTest = "";
const firstExaminationBody = {
    from: "2023-01-01",
    to: "2023-01-31",
    shop_id: "",
    status: "Lấy mẫu và kiểm định",
};

let firstTestIdTest = "";
const firstTestBody = {
    taken: "2023-01-01",
    status: "Đã xử lý xong",
    result: "Đạt",
    processing_unit: "Cơ sở 1",
    result_date: "2023-01-31",
};

let accessToken = "";
let refreshToken = "";
const newFirstName = "JoJo";
const newFirstName2 = "Giorgio";
const newLastName2 = "Giovanni";
const newWard = firstShopBody.ward;
const newAddress = "Số 6 Giải Phóng";
const newFrom = "2023-01-15";
const newProcessingUnit = "Cơ sở 3, đường 3";

const DELETE_DATA = true;

describe("users and auth endpoints", function () {
    let request: supertest.SuperAgentTest;

    before(function () {
        request = supertest.agent(app);
    });

    after(function (done) {
        app.close(() => {
            mongoose.connection.close(done);
        });
    });

    it("should allow a POST to /users", async function () {
        if (DELETE_DATA) {
            await MongooseService.clearCollections();
        }
        const res = await request.post("/users").send(firstUserBody);
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.be.a("string");
        firstUserIdTest = res.body.id;
    });

    it("should allow a POST to /auth", async function () {
        const res = await request.post("/auth").send(firstUserBody);
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body.accessToken).to.be.a("string");
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it("should allow a GET from /users/:userId with an access token", async function () {
        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body._id).to.be.a("string");
        expect(res.body._id).to.equal(firstUserIdTest);
        expect(res.body.email).to.equal(firstUserBody.email);
    });

    describe("with a valid access token", function () {
        it("should disallow a GET to /users", async function () {
            const res = await request
                .get(`/users`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(403);
        });

        it("should disallow a PATCH to /users/:userId", async function () {
            const res = await request
                .patch(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    ...firstUserBody,
                    firstName: newFirstName,
                });
            expect(res.status).to.equal(403);
        });

        it("should disallow a PUT to /users/:userId with an nonexistent ID", async function () {
            const res = await request
                .put(`/users/i-do-not-exist`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    ...firstUserBody,
                    ward: newWard,
                    firstName: "Marcos",
                    lastName: "Silva",
                    permissionFlags: 256,
                });
            expect(res.status).to.equal(404);
        });

        it("should disallow a PUT to /users/:userId trying to change the permission flags", async function () {
            const res = await request
                .put(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    ward: newWard,
                    firstName: "Marcos",
                    lastName: "Silva",
                    permissionFlags: 256,
                });
            expect(res.status).to.equal(403);
        });

        it("should disallow a GET to /shops/page/:page?/limit/:limit? to get a list of all shops", async function () {
            const res = await request
                .get(`/shops/page/1/limit/10`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(403);
        });

        describe("with admin permission flag", function () {
            it("should allow a POST to /auth", async function () {
                const adminUser = await MongooseService.createAdminUser();
                const adminUserBody = {
                    email: adminUser.email,
                    password: adminUser.password,
                };
                const res = await request.post("/auth").send(adminUserBody);
                expect(res.status).to.equal(201);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an("object");
                expect(res.body.accessToken).to.be.a("string");
                accessToken = res.body.accessToken;
                refreshToken = res.body.refreshToken;
            });

            it("should allow a PUT to /users/:userId to change first and last names", async function () {
                const res = await request
                    .put(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                        ...firstUserBody,
                        ward: newWard,
                        firstName: newFirstName2,
                        lastName: newLastName2,
                        permissionFlags: 3,
                    });
                expect(res.status).to.equal(204);
            });

            it("should allow a GET from /users/:userId and should have a new full name", async function () {
                const res = await request
                    .get(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                expect(res.status).to.equal(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an("object");
                expect(res.body._id).to.be.a("string");
                expect(res.body.ward).to.equal(newWard);
                expect(res.body.firstName).to.equal(newFirstName2);
                expect(res.body.lastName).to.equal(newLastName2);
                expect(res.body.email).to.equal(firstUserBody.email);
                expect(res.body._id).to.equal(firstUserIdTest);
            });

            it("should allow a POST to /shops/create", async function () {
                const res = await request
                    .post(`/shops/create`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send(firstShopBody);
                expect(res.status).to.equal(201);
            });

            it("should allow a GET to /shops/page/:page?/limit/:limit? to get a list of all shops", async function () {
                const res = await request
                    .get(`/shops/page/0/limit/10`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                expect(res.status).to.equal(200);
            });

            describe("with specialist permission flag and ward assigned", function () {
                it("should allow a POST to /auth", async function () {
                    const res = await request.post("/auth").send(firstUserBody);
                    expect(res.status).to.equal(201);
                    expect(res.body).not.to.be.empty;
                    expect(res.body).to.be.an("object");
                    expect(res.body.accessToken).to.be.a("string");
                    accessToken = res.body.accessToken;
                    refreshToken = res.body.refreshToken;
                });

                it("should allow a POST to /shops/create", async function () {
                    const res = await request
                        .post(`/shops/create`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send(firstShopBody);
                    expect(res.status).to.equal(201);
                    firstShopIdTest = res.body.id;
                });

                it("should allow a GET to /shops/managedby/:userId/:page?/:limit? to get a list of shops managed by a user", async function () {
                    const res = await request
                        .get(`/shops/managedby/${firstUserIdTest}/0/10`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                });

                it("should allow a GET to /shops/:shopId/users/:userId to get a shop managed by a user", async function () {
                    const res = await request
                        .get(
                            `/shops/${firstShopIdTest}/users/${firstUserIdTest}`
                        )
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                    expect(res.body.name).equal(firstShopBody.name);
                });

                it("should allow a PATCH to /shops/:shopId/users/:userId to update a shop managed by a user", async function () {
                    const res = await request
                        .patch(
                            `/shops/${firstShopIdTest}/users/${firstUserIdTest}`
                        )
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                            address: newAddress,
                        });
                    expect(res.status).to.equal(204);
                });

                it("should allow a POST to /examinations/create to create an examination", async function () {
                    const res = await request
                        .post(`/examinations/create`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                            ...firstExaminationBody,
                            shop_id: firstShopIdTest,
                        });
                    expect(res.status).to.equal(201);
                    firstExaminationIdTest = res.body.id;
                });

                it("should allow a GET to /examinations/page/:page?/limit/:limit?", async function () {
                    const res = await request
                        .get(`/examinations/page/0/limit/10`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                });

                it("should allow a GET to /examinations/of/:shopId/:page?/:limit? to get a list of examinations for a shop", async function () {
                    const res = await request
                        .get(`/examinations/of/${firstShopIdTest}/0/10`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                });

                it("should allow a GET to /examinations/:examinationId to get an examination", async function () {
                    const res = await request
                        .get(`/examinations/${firstExaminationIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                    expect(res.body.from).equal(
                        `${firstExaminationBody.from}T00:00:00.000Z`
                    );
                });

                it("should allow a PATCH to /examinations/:examinationId to patch an examination", async function () {
                    const res = await request
                        .patch(`/examinations/${firstExaminationIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                            from: newFrom,
                        });
                    expect(res.status).to.equal(204);
                });

                it("should allow a GET to /examinations/:examinationId to get an updated examination", async function () {
                    const res = await request
                        .get(`/examinations/${firstExaminationIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                    expect(res.body.from).equal(`${newFrom}T00:00:00.000Z`);
                });

                it("should allow a POST to /tests/create to create a test", async function () {
                    const res = await request
                        .post(`/tests/create`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send(firstTestBody);
                    expect(res.status).to.equal(201);
                    firstTestIdTest = res.body.id;
                });

                it("should allow a GET to /tests/:testId to get a test", async function () {
                    const res = await request
                        .get(`/tests/${firstTestIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                    expect(res.body.processing_unit).equal(
                        firstTestBody.processing_unit
                    );
                });

                it("should allow a PATCH to /tests/:testId to patch a test", async function () {
                    const res = await request
                        .patch(`/tests/${firstTestIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                            processing_unit: newProcessingUnit,
                        });
                    expect(res.status).to.equal(204);
                });

                it("should allow a GET to /tests/:testId to get an updated test", async function () {
                    const res = await request
                        .get(`/tests/${firstTestIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    expect(res.status).to.equal(200);
                    expect(res.body.processing_unit).equal(newProcessingUnit);
                });

                it("should allow a PATCH to /examinations/:examinationId to add a new test in an examination", async function () {
                    const res = await request
                        .patch(`/examinations/${firstExaminationIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                            test_id: firstTestIdTest,
                        });
                    expect(res.status).to.equal(204);
                });

                if (DELETE_DATA) {
                    it("should allow a DELETE to /examinations/:examinationId to delete an examination", async function () {
                        const res = await request
                            .delete(`/examinations/${firstExaminationIdTest}`)
                            .set({ Authorization: `Bearer ${accessToken}` })
                            .send();
                        expect(res.status).to.equal(204);
                    });

                    it("should allow a DELETE to /tests/:testId to delete a test", async function () {
                        const res = await request
                            .delete(`/tests/${firstTestIdTest}`)
                            .set({ Authorization: `Bearer ${accessToken}` })
                            .send();
                        expect(res.status).to.equal(204);
                    });

                    it("should allow a DELETE to /shops/:shopId/users/:userId to delete a shop managed by a user", async function () {
                        const res = await request
                            .delete(
                                `/shops/${firstShopIdTest}/users/${firstUserIdTest}`
                            )
                            .set({ Authorization: `Bearer ${accessToken}` });
                        expect(res.status).to.equal(204);
                    });

                    it("should allow a DELETE to /users/:userId to delete a user", async function () {
                        const res = await request
                            .delete(`/users/${firstUserIdTest}`)
                            .set({ Authorization: `Bearer ${accessToken}` })
                            .send();
                        expect(res.status).to.equal(204);
                    });
                }
            });
        });
    });
});
