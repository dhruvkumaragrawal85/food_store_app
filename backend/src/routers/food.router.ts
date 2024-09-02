import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from 'express-async-handler';
import { FoodModel } from "../models/food.model";
const router=Router();//create router

// "seed API" for MongoDB is a tool or script that automatically
//  inserts some initial or sample data into your MongoDB database


//async handler automatically handles errors that may come arise due simulataneous running
//async function handles tasks that take time without stopping code
//await FoodModel.find(): This line fetches all the food items from the database. 
//The code waits for this to finish before sending the results back.

router.get("/seed", asyncHandler(
  async(req, res) => {
    const foodsCount=await FoodModel.countDocuments();
    if(foodsCount>0)
    {
      res.send('seed is already done');
      return;
    }
    await FoodModel.create(sample_foods);
    res.send("Seed is done");
  }
))

router.get("/",asyncHandler(
  async (req, res) => {
    const foods = await FoodModel.find();
      res.send(foods);
  }
))

router.get("/search/:searchTerm", asyncHandler(
  async (req, res) => {
    //creating a regular expression, search case insensitive
    const searchRegex = new RegExp(req.params.searchTerm, 'i');
    const foods = await FoodModel.find({name: {$regex:searchRegex}})
    res.send(foods);
  }
))


router.get("/tags", asyncHandler(
  async (req, res) => {
    //collect all that match tags
    const tags = await FoodModel.aggregate([
      {
        //fields start with dollars
        $unwind:'$tags'//2 food 3 tags=>6 food 1 tags
      },
      {
        $group:{
          _id: '$tags',
          count: {$sum: 1}//add new items to tag
        }
      },
      {
        $project:{
          _id: 0,
          name:'$_id',
          count: '$count'//formats the data to include just the tag's name and its count, dropping the _id field
        }
      }
    ]).sort({count: -1});//descending

    const all = {
      name : 'All',
      count: await FoodModel.countDocuments()
    }

    tags.unshift(all);//all to the beginning of the array
    res.send(tags);
  }
))


router.get("/tag/:tagName",asyncHandler(
  async (req, res) => {
    const foods = await FoodModel.find({tags: req.params.tagName})
    res.send(foods);
  }
))

router.get("/:foodId", asyncHandler(
  async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  }
))

export default router;