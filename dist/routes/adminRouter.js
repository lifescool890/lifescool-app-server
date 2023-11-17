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
exports.adminRouter = void 0;
const express_1 = require("express");
const adminHelper_1 = require("../helpers/adminHelper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
exports.adminRouter = (0, express_1.Router)();
let key = process.env.AWS_ACCESS_KEY;
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const s3CoverStorage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: "lifescool",
    // storage access type
    key: function (req, file, cb) {
        cb(null, "cover-images/" + req.params.id);
    },
});
const s3TutorStorage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: "lifescool",
    // storage access type
    key: function (req, file, cb) {
        cb(null, "tutor-images/" + req.params.id);
    },
});
const s3ReviewStorage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: "lifescool",
    // storage access type
    key: function (req, file, cb) {
        cb(null, "review-images/" + req.params.id + "/" + file.originalname);
    },
});
const reviewImageUpload = (0, multer_1.default)({ storage: s3ReviewStorage }).array("images");
const tutorImageUpload = (0, multer_1.default)({ storage: s3TutorStorage }).single("tutorImage");
const coverImageUpload = (0, multer_1.default)({ storage: s3CoverStorage }).single("coverImage");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("yeahhhh");
    console.log(authHeader);
    if (authHeader) {
        let token = authHeader.split(" ")[1];
        const key = process.env.SECRET_KEY;
        console.log(key);
        console.log(token);
        jsonwebtoken_1.default.verify(JSON.parse(token), key, (err) => {
            console.log(err);
            if (err) {
                return res.sendStatus(403);
            }
            console.log("yes");
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.adminRouter.post("/auth", verifyToken, (req, res) => {
    console.log("yeah");
    res
        .status(200)
        .json({ authentication: true, message: "token validation success" });
});
exports.adminRouter.get("/", (req, res) => {
    res.send("router is working");
});
exports.adminRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    console.log(req.body);
    console.log(req.headers.authorization);
    const user = yield adminHelper_1.adminHelper.loginAuthentication(req.body.username, req.body.password);
    console.log(user);
    if (user.authentication == true) {
        res.status(200).json({
            authentication: true,
            message: "authentication successfull",
            authToken: user.userToken,
        });
    }
    else {
        console.log("fail");
        res
            .status(204)
            .json({ authentication: false, message: "user not authenticated" });
    }
}));
exports.adminRouter.post("/addAdmin", (req, res) => {
    adminHelper_1.adminHelper.addAdmin(req.body.username, req.body.password).then(() => {
        res.send("succesfully added");
    });
});
exports.adminRouter.post("/addCourse", (req, res) => {
    console.log("yesssss");
    console.log(req.body);
    adminHelper_1.adminHelper.addCourse(req.body).then((response) => {
        console.log("courseres", response);
        res.status(200).json({ message: "course added successfully", data: response });
    });
});
exports.adminRouter.post("/addTutorImage/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    tutorImageUpload(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        let file = req.file;
    }));
}));
exports.adminRouter.post("/addReviewImage/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.params);
    console.log((_a = req.files) === null || _a === void 0 ? void 0 : _a.keys);
    reviewImageUpload(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(error);
    }));
}));
exports.adminRouter.post("/addCoverImage/:id", (req, res) => {
    coverImageUpload(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.file);
    }));
});
exports.adminRouter.post("/review-images", (req, res) => {
    const image = req.body.image;
    console.log({ image });
});
exports.adminRouter.get("/getAllCourses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield adminHelper_1.adminHelper
        .getCourses()
        .then((response) => {
        console.log(response);
        res.status(200).json({ data: response, message: "all courses are here" });
    })
        .catch((err) => {
        res.status(400).json({ error: err, message: " error occured" });
    });
}));
exports.adminRouter.post("/getOneCourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    yield adminHelper_1.adminHelper
        .getOneCourse(id)
        .then((response) => {
        res
            .status(200)
            .json({ data: response, message: "one course fetched successfully" });
    })
        .catch((err) => {
        res.status(400).json({ error: err, message: " error occured" });
    });
}));
exports.adminRouter.post("/updateCourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield adminHelper_1.adminHelper
        .updateCourse(req.body)
        .then((response) => {
        res.status(200).json({ data: response, message: "updated successfully" });
    })
        .catch((err) => {
        res.status(400).json({ error: err, message: " error occured" });
    });
}));
exports.adminRouter.post("/deleteCourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield adminHelper_1.adminHelper
        .deleteCourse(req.body.id)
        .then((response) => {
        res.status(200).json({ data: response, message: "deleted successfully" });
    })
        .catch((err) => {
        res.status(400).json({ error: err, message: " error occured" });
    });
}));
exports.adminRouter.post("/setTrending", (req, res) => {
    adminHelper_1.adminHelper.addTrending(req.body).then((response) => {
        res.status(200).json({ message: "trending setting done" });
    }).catch(() => {
        res.status(400).json({ message: "error occured" });
    });
});
exports.adminRouter.get("/getTrending", (req, res) => {
    adminHelper_1.adminHelper.getTrending().then((response) => {
        res.status(200).json({ data: response, message: "trending fetched succesfully" });
    }).catch(() => {
        res.status(400).json({ message: "error occured" });
    });
});
