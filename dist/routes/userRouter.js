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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const adminHelper_1 = require("../helpers/adminHelper");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/getOneCourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bod", req.body);
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
exports.userRouter.get("/getAllCourses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
