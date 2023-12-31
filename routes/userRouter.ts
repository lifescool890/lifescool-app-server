import { Router, Request, Response } from "express";
import { adminHelper } from "../helpers/adminHelper";

export const userRouter: any = Router();

userRouter.post("/getOneCourse", async (req: Request, res: Response) => {
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

userRouter.get("/getAllCourses", async (req: Request, res: Response) => {
  await adminHelper
    .getCourses()
    .then((response) => {
      res.status(200).json({ data: response, message: "all courses are here" });
    })
    .catch((err) => {
      res.status(400).json({ error: err, message: " error occured" });
    });
});
