"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHelper = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma = new client_1.PrismaClient();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
exports.adminHelper = {
    loginAuthentication: (userName, password) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(userName);
            const user = yield prisma.user.findFirst({
                where: {
                    userName: userName,
                },
            });
            console.log(user);
            if (user) {
                console.log("yes");
                yield bcrypt_1.default.compare(password, user.password).then((response) => {
                    console.log(response);
                    if (response) {
                        const key = process.env.SECRET_KEY;
                        const userToken = jsonwebtoken_1.default.sign({ username: userName }, key);
                        resolve({ authentication: true, userToken: userToken });
                    }
                });
            }
            else {
                console.log("no");
                resolve({ authentication: false });
            }
        }));
    }),
    addAdmin: (userName, password) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            let hashedPassword = yield bcrypt_1.default.hash(password, 10);
            console.log(hashedPassword);
            yield prisma.user
                .create({
                data: {
                    userName: userName,
                    password: hashedPassword,
                },
            })
                .then((response) => {
                resolve(response);
            });
        }));
    }),
    addCourse: (values) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("val", values);
            yield prisma.courses.create({
                data: {
                    courseName: values.courseName,
                    courseDesc: values.courseDesc,
                    promoLink: values.promoLink,
                    upComingStartingDate: values.upcomingDate[0],
                    upComingEndingDate: values.upcomingDate[1],
                    courseOverView: values.courseOverView,
                    coursePoints: values.coursePoints,
                    faq: values.faq,
                    price: Number(values.price),
                    tutorName: values.tutorName,
                    tutorDesc: values.tutorDesc,
                }
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                rejects(err);
            });
        }));
    }),
    getCourses: () => {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("courses");
            const courses = yield prisma.courses.findMany().then((response) => {
                console.log(response);
                resolve(response);
            });
            console.log(courses);
        }));
    },
    getOneCourse: (id) => {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(id);
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: `lifescool`,
                Prefix: `review-images/${id}/`
            });
            let details = {};
            const course = yield prisma.courses.findUnique({
                where: {
                    id: id
                }
            }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const data = yield s3.send(command);
                const baseURL = process.env.REVIEW_IMG_BASE_URL || "";
                let urlArray = (_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map(e => { var _a; return baseURL + ((_a = (e.Key)) === null || _a === void 0 ? void 0 : _a.split(" ").join("+")); });
                details = {
                    data: response,
                    images: urlArray
                };
                resolve(details);
            }));
        }));
    },
    updateCourse: (values) => {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("val", values);
            yield prisma.courses.update({
                where: {
                    id: Number(values.id)
                },
                data: {
                    courseName: values.courseName,
                    courseDesc: values.courseDesc,
                    promoLink: values.promoLink,
                    upComingStartingDate: values.upcomingDate[0],
                    upComingEndingDate: values.upcomingDate[1],
                    courseOverView: values.courseOverView,
                    coursePoints: values.coursePoints,
                    faq: values.faq,
                    tutorDesc: values.tutorDesc,
                    price: values.price,
                    tutorName: values.tutorName,
                }
            }).then((response) => {
                resolve(response);
            });
        }));
    },
    deleteCourse: (id) => {
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("deletete");
            yield prisma.courses.delete({
                where: {
                    id: id
                }
            }).then((response) => {
                resolve(response);
            });
        }));
    },
    addTrending: (values) => {
        console.log("val", values);
        return new Promise((resolve, rejects) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.trending.update({
                where: {
                    id: 1
                }, data: {
                    trending1: values.trending1,
                    trending2: values.trending2,
                    trending3: values.trending3,
                    trending4: values.trending4,
                    trending5: values.trending5,
                    trending6: values.trending6
                }
            }).then((response) => {
                resolve(response);
            });
        }));
    },
    getTrending: () => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.trending.findUnique({
                where: {
                    id: 1
                },
                select: {
                    trending1: true,
                    trending2: true,
                    trending3: true,
                    trending4: true,
                    trending5: true,
                    trending6: true
                }
            }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(response);
                if (response) {
                    let ids = Object.values(response);
                    console.log(ids);
                    yield prisma.courses.findMany({
                        where: {
                            id: { in: ids }
                        }
                    }).then((response) => {
                        console.log(response);
                        resolve(response);
                    }).catch(() => {
                        reject();
                    });
                }
                else {
                    reject();
                }
            }));
        }));
    }
};
