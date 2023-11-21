import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { S3Client,ListObjectsV2Command } from "@aws-sdk/client-s3";


const prisma = new PrismaClient();
const s3 = new S3Client({
  region: 'ap-south-1', 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY||'',
  },
})
interface FormValue{
  id:number
  courseName:string
  courseDesc:string
  promoLink:string
  upcomingDate:string[]
  courseOverView:string
  coursePoints:string[]
  faq:string[]
  tutorDesc:string
  updatedDate:Date
  price:number
  tutorName:string
}
interface trendingValues{
  trending1:number
  trending2:number
  trending3:number
  trending4:number
  trending5:number
  trending6:number
}

export const adminHelper = {
  loginAuthentication: async (userName: string, password: string) => {
    return new Promise(async (resolve, rejects) => {
      console.log(userName);

      const user = await prisma.user.findFirst({
        where: {
          userName: userName,
        },
      });
      console.log(user);
      
      if (user) {
        console.log("yes");
        
        await bcrypt.compare(password, user.password).then((response) => {
          console.log(response);
          if(response){
            const key = process.env.SECRET_KEY
             const userToken = jwt.sign({username:userName},key!)
             resolve({authentication:true,userToken:userToken});
          }
        });
      }else{
        console.log("no");
        
        resolve({authentication:false})
      }
    });
  },

  addAdmin: async (userName: string, password: string) => {
    return new Promise(async (resolve, rejects) => {
      let hashedPassword: any = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      await prisma.user
        .create({
          data: {
            userName: userName,
            password: hashedPassword,
          },
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  addCourse:async(values:FormValue)=>{
    return new Promise(async(resolve,rejects)=>{
      console.log("env");
      
      console.log(process.env.AWS_DEFAULT_REGION);
      console.log(process.env.AWS_ACCESS_KEY_ID);
      console.log(process.env.AWS_SECRET_ACCESS_KEY);
      console.log("val",values);
      
      
      await prisma.courses.create({
        data:{
          courseName:values.courseName,
          courseDesc:values.courseDesc,
          promoLink:values.promoLink,
          upComingStartingDate:values.upcomingDate[0],
          upComingEndingDate:values.upcomingDate[1],
          courseOverView:values.courseOverView,
          coursePoints:values.coursePoints,
          faq:values.faq,
          price:Number(values.price),
          tutorName:values.tutorName,
          tutorDesc:values.tutorDesc,
        }
      }).then((response)=>{
        resolve(response)
        
      }).catch((err)=>{
        rejects(err)
      })
     
    })
  },

  getCourses:()=>{
    return new Promise(async(resolve,rejects)=>{
      console.log("courses");
      
     const courses=await  prisma.courses.findMany().then((response)=>{
      console.log(response);
      resolve(response)
      
     })
     console.log(courses);
     
    })
  },

  getOneCourse:(id:number)=>{
    return new Promise(async(resolve,rejects)=>{
      console.log(process.env.AWS_DEFAULT_REGION);
      const command =new ListObjectsV2Command({
        Bucket:`lifescool`,
        Prefix: `review-images/${id}/`
      })
      let details ={}
      const course = await prisma.courses.findUnique({
        where:{
          id:id
        }
      }).then(async(response)=>{
        const data =await s3.send(command);
        const baseURL =process.env.REVIEW_IMG_BASE_URL||""
        let urlArray = data.Contents?.map(e=>baseURL+((e.Key)?.split(" ").join("+")))
        details={
          data :response,
          images:urlArray
        }
        resolve(details)
      })
    })
  },

  updateCourse:(values:FormValue)=>{
    return new Promise(async(resolve,rejects)=>{
      console.log("val",values);
       await prisma.courses.update({
        where:{
          id:Number(values.id)
        },
        data:{
          courseName:values.courseName,
          courseDesc:values.courseDesc,
          promoLink:values.promoLink,
          upComingStartingDate:values.upcomingDate[0],
          upComingEndingDate:values.upcomingDate[1],
          courseOverView:values.courseOverView,
          coursePoints:values.coursePoints,
          faq:values.faq,
          tutorDesc:values.tutorDesc,
          price:values.price,
          tutorName:values.tutorName,
        }
       }).then((response)=>{
        resolve(response)
       })
    })

  },

  deleteCourse:(id:number)=>{
    return new Promise(async(resolve,rejects)=>{
      console.log("deletete");
      
      await prisma.courses.delete({
        where:{
          id:id
        }
      }).then((response)=>{
        resolve(response)
      })
    })
  },

  addTrending:(values:trendingValues)=>{
    console.log("val",values);
    
      return new Promise(async(resolve,rejects)=>{
        await prisma.trending.update({
          where:{
            id:1
          },data:{
            trending1:values.trending1,
            trending2:values.trending2,
            trending3:values.trending3,
            trending4:values.trending4,
            trending5:values.trending5,
            trending6:values.trending6
          }
      }).then((response)=>{
        resolve(response)
      })
  })
},

  getTrending:()=>{
    return new Promise(async(resolve,reject)=>{
      await prisma.trending.findUnique({
        where:{
          id:1
        },
        select:{
          trending1:true,
          trending2:true,
          trending3:true,
          trending4:true,
          trending5:true,
          trending6:true
        }
        
      }).then(async(response)=>{
        console.log(response);
        if(response){
          let ids= Object.values(response)
          console.log(ids);
          await prisma.courses.findMany({
            where:{
              id:{in:ids}

            }
          }).then((response)=>{
            console.log(response);
            resolve(response)
          }).catch(()=>{
            reject()
          })
          
        }else{
          reject()
        }
 
      })
    })
  }
}
