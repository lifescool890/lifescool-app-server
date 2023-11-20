import express, { Request, Response } from 'express';
import {adminRouter} from "./routes/adminRouter";
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRouter';

const app = express();
const port = process.env.PORT || 3000
app.use(cors());

app.use(bodyParser.json({limit: '105mb'}));
app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '105mb',
    parameterLimit: 50000,
    }),
  );
 
// app.post("/admin/login",(req,res)=>{
//     console.log(req.body);
    
// })

app.use("/admin",adminRouter)
app.use("/",userRouter)

// var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   res.send('welcome, ' + req.body.username)
// })
 
app.listen(port,()=>{
    console.log(`server running on ${port}`);
    
})