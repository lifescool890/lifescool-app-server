import { Router, Request, Response, response } from "express";
import { adminHelper } from "../helpers/adminHelper";
import jwt from "jsonwebtoken";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const adminRouter: any = Router();

interface MulterRequest extends Request {
  file: any;
  params:any;
}
const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "", 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY||'',
  },
});



const s3CoverStorage = multerS3({
  s3: s3, // s3 instance
  bucket: "lifescool", // change it as per your project requirement
  // storage access type
  key: function (req:MulterRequest, file, cb) {
    cb(null, "cover-images/" +req.params.id);
  },
});
const s3TutorStorage = multerS3({
  s3: s3, // s3 instance
  bucket: "lifescool", // change it as per your project requirement
  // storage access type
  key: function (req:MulterRequest, file, cb) {
    cb(null, "tutor-images/" +req.params.id);
  },
});
const s3ReviewStorage = multerS3({
  s3: s3, // s3 instance
  bucket: "lifescool", // change it as per your project requirement
  // storage access type
  
  key: function (req:MulterRequest, file, cb) {
    cb(null, "review-images/"+ req.params.id+"/"+file.originalname);
  },
});

const reviewImageUpload = multer({ storage: s3ReviewStorage }).array("images");

const tutorImageUpload = multer({ storage: s3TutorStorage }).single(
  "tutorImage"
);

const coverImageUpload = multer({ storage: s3CoverStorage }).single(
  "coverImage"
);

const verifyToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  console.log("yeahhhh");
  console.log(authHeader);

  if (authHeader) {
    let token = authHeader.split(" ")[1];
    const key: any = process.env.SECRET_KEY;

    console.log(key);

    console.log(token);

    jwt.verify(JSON.parse(token), key, (err: any) => {
      console.log(err);

      if (err) {
        return res.sendStatus(403);
      }
      console.log("yes");

      next();
    });
  } else {
    res.sendStatus(401);
  }
};

adminRouter.post("/auth", verifyToken, (req: Request, res: Response) => {
  console.log("yeah");
  res
    .status(200)
    .json({ authentication: true, message: "token validation success" });
});

adminRouter.get("/", (req: Request, res: Response) => {
  res.send("router is working");
});

adminRouter.post("/login", async (req: Request, res: Response) => {
  console.log("hello");
  console.log(req.body);
  console.log(req.headers.authorization);
  const user: any = await adminHelper.loginAuthentication(
    req.body.username,
    req.body.password
  );
  console.log(user);

  if (user.authentication == true) {
    res.status(200).json({
      authentication: true,
      message: "authentication successfull",
      authToken: user.userToken,
    });
  } else {
    console.log("fail");

    res
      .status(204)
      .json({ authentication: false, message: "user not authenticated" });
  }
});

adminRouter.post("/addAdmin", (req: Request, res: Response) => {
  adminHelper.addAdmin(req.body.username, req.body.password).then(() => {
    console.log(req);
    
    res.send("succesfully added");
  });
});

adminRouter.post("/addCourse", (req: Request, res: Response) => {
  console.log("yesssss");
  console.log(req.body);

  adminHelper.addCourse(req.body).then((response)=>{
    console.log("courseres",response);
    
    res.status(200).json({message:"course added successfully",data:response})
  })

  
});
adminRouter.post("/addTutorImage/:id", async (req: Request, res: Response) => {
  console.log("awstest",req);
  
  tutorImageUpload(req, res, async (error) => {
    console.log("errrrrrrEEE",error);
    
  });
});
adminRouter.post("/addReviewImage/:id", async (req: Request, res: Response) => {
  console.log("awstest",req);
  console.log(req.params);
  console.log(req.files?.keys);
  reviewImageUpload(req, res, async (error) => {
    console.log(error);
    

  });
});

adminRouter.post("/addCoverImage/:id", (req: Request, res: Response) => {
  coverImageUpload(req, res, async (error) => {
    console.log(req.file);
  });
});
adminRouter.post("/review-images", (req: Request, res: Response) => {
  const image = req.body.image;
  console.log({ image });
});
adminRouter.get("/getAllCourses", async (req: Request, res: Response) => {
  await adminHelper
    .getCourses()
    .then((response) => {
      console.log(response);
      res.status(200).json({ data: response, message: "all courses are here" });
    })
    .catch((err) => {
      res.status(400).json({ error: err, message: " error occured" });
    });
});

adminRouter.post("/getOneCourse", async (req: Request, res: Response) => {
  const id = req.body.id;
  await adminHelper
    .getOneCourse(id)
    .then((response) => {
      res
        .status(200)
        .json({ data: response, message: "one course fetched successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err, message: " error occured" });
    });
});

adminRouter.post("/updateCourse", async (req: Request, res: Response) => {
  await adminHelper
    .updateCourse(req.body)
    .then((response) => {
      res.status(200).json({ data: response, message: "updated successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err, message: " error occured" });
    });
});

adminRouter.post("/deleteCourse", async (req: Request, res: Response) => {
  await adminHelper
    .deleteCourse(req.body.id)
    .then((response) => {

      res.status(200).json({ data: response, message: "deleted successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err, message: " error occured" });
    });
});

adminRouter.post("/setTrending",(req:Request,res:Response)=>{
  adminHelper.addTrending(req.body).then((response)=>{
    res.status(200).json({message:"trending setting done"})
    
  }).catch(()=>{
    res.status(400).json({message:"error occured"})
  })
  
})

adminRouter.get("/getTrending",(req:Request,res:Response)=>{
  adminHelper.getTrending().then((response)=>{
    res.status(200).json({data:response,message:"trending fetched succesfully"})
  }).catch(()=>{
    res.status(400).json({message:"error occured"})
  })
})
