const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


//importing models
const userModel = require('./models/userModel');
const foodModel = require('./models/foodModel');
const trackingModel = require("./models/trackingModel");
const verifyToken = require('./verifyToken');




//database connection

mongoose.connect("mongodb://localhost:27017/nutrify")
.then(()=>{
    console.log("database connection successfull")
})
.catch((err)=>{
    console.log(err);
})

const app=express();

app.use(express.json());
app.use(cors())

//endpoint for use registration
app.post("/register",(req,res)=>{

    let user=req.body; 
   
        bcrypt.genSalt(10,(err,salt)=>{
            if(!err)
            {
                bcrypt.hash(user.password,salt,async(err,hpass)=>{
                    if(!err)
                    {
                        user.password=hpass;
                        try
                        {    
                          let doc= await userModel.create(user)
                           res.send({message:"user registered"})
                        }
                    catch(err){
                          console.log(err);
                          res.status(500).send({message:"some error occured"})
                    }
                    }
                })
            }
        })   
    
})



//endpoint to see all items

app.get("/food",verifyToken,async(req,res)=>{
    try
    {
      let food=await foodModel.find();
      res.send(food);
    }
    catch(err)
    {
      console.log(err);
      res.status(500).send({message:"some problem while getting info"})
    }
})





//endpoint for login

app.post("/login",async(req,res)=>{

    let userCred=req.body;
   
   try
   {
    const user=await userModel.findOne({email:userCred.email});
    if(user!==null)
    {
         bcrypt.compare(userCred.password,user.password,(err,success)=>{
            if(success==true)
            {
                jwt.sign({email:userCred.email},"key",(err,token)=>{
                    if(!err)
                    {
                        res.send({message:"login success",name:user.name,id:user.id,token:token})
                    }
                })
            }
            else{
                res.status(403).send({message:"incorrect password"})
            }
         })
    }
    else{
        res.status(404).send({message:"user not found"})
    }
   }
   catch(err)
   {
       console.log(err);
       res.status(500).send({message:"error occured"})
   }
})






//endpoint to search food by name

app.get("/food/:name",verifyToken,async(req,res)=>{
    try
    {
       let food=await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
       if(food.length!=0)
       {
           res.send(food);
       }
       else
       {
        res.status(404).send({message:"food item not found"})
       }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"some error occured while getting food"})
    }
})





//endpoint to track food

app.post("/track",verifyToken,async(req,res)=>{
    let trackData=req.body;
    try
    {
        let data= await trackingModel.create(trackData)
        console.log(data);
        res.status(201).send({message:"food added"})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"some error occured while adding"})
    }
    
})





//endpoint to fetch all items ate by a person
app.get("/track/:userid/:date",verifyToken,async(req,res)=>{

    let userid=req.params.userid;
    let date=new Date(req.params.date);
    let strDate=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();


    try
    {
        let foods=await trackingModel.find({userId:userid,eatenDate:strDate}).populate('userId').populate('foodId')
        res.send(foods);  
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"some error occured while adding"})
    }
})








//all the remaining end points work only with the token-so middleware(verifyToken) is required




app.listen(8000,()=>{
    console.log("server is up and running")
})

//endpoints-------------1.register -- 2.login -- 3.search food by name -- 4.track food for me -- 5.show my tracked foods

