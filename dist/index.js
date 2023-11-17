"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter_1 = require("./routes/adminRouter");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRouter_1 = require("./routes/userRouter");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '105mb' }));
app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: '105mb',
    parameterLimit: 50000,
}));
// app.post("/admin/login",(req,res)=>{
//     console.log(req.body);
// })
app.use("/admin", adminRouter_1.adminRouter);
app.use("/", userRouter_1.userRouter);
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   res.send('welcome, ' + req.body.username)
// })
app.listen(port, () => {
    console.log(`server running on ${port}`);
});
