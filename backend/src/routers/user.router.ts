import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
import auth from "../middlewares/auth.mid";
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
dotenv.config();
const router=Router();

// "seed API" for MongoDB is a tool or script that automatically
//  inserts some initial or sample data into your MongoDB database


//async handler automatically handles errors that may come arise due simulataneous running
//async function handles tasks that take time without stopping code
//await FoodModel.find(): This line fetches all the food items from the database. 
//The code waits for this to finish before sending the results back.

router.get("/seed", asyncHandler(
  async(req, res) => {
    const usersCount=await UserModel.countDocuments();
    if(usersCount>0)
    {
      res.send('seed is already done');
      return;
    }
    await UserModel.create(sample_users);
    res.send("Seed is done");
  }
))
router.post("/login", asyncHandler(
  async (req, res) => {
    const {email, password} = req.body;//received from frontend
    const user = await UserModel.findOne({email});//search if matching email exists
  
     if(user && (await bcrypt.compare(password,user.password))) {
      res.send(generateTokenResponse(user));
     }
     else{
       res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
     }
  
  }
))
  
  

router.post('/register', asyncHandler(
  async (req, res) => {
    const {name, email, password, address} = req.body;//from request it will get
    const user = await UserModel.findOne({email});
    if(user){//if email exists error
      res.status(HTTP_BAD_REQUEST)
      .send('User is already exist, please login!');
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);//salt of the hash, bigger better but more resources

    const newUser:User = {
      id:'',
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  }
))


router.put(
  "/updateProfile",
  auth,
  asyncHandler(async (req: any, res) => {
      const { name, address } = req.body;
      const user = await UserModel.findByIdAndUpdate(
          req.user.id,
          { name, address },
          { new: true }
      );

      if (user) {
          res.send(generateTokenResponse(user));
      } else {
          res.status(HTTP_BAD_REQUEST).send("User not found!");
      }

      // OR res.send(generateTokenResponse(user!));
  })
);

router.put(
  "/changePassword",
  auth,
  asyncHandler(async (req: any, res) => {
      const { currentPassword, newPassword } = req.body;
      const user = await UserModel.findById(req.user.id);

      if (!user) {
          res.status(HTTP_BAD_REQUEST).send("User not found!");
          return;
      }

      const equal = await bcrypt.compare(currentPassword, user.password);
      if (!equal) {
          res.status(HTTP_BAD_REQUEST).send("Curent Password Is Not Correct!");
      } else {
          user.password = await bcrypt.hash(newPassword, 10);
          await user.save();

          res.send();
      }
  })
);


  const generateTokenResponse = (user:any)=>{
    const token=jwt.sign({
      id: user.id, email:user.email, isAdmin:user.isAdmin
    }, JWT_SECRET, {
      expiresIn:"120d"
    });
  
    // user.token=token;
    // return user;

    return {...user.toObject(), token};
  }
  

  export default router;