import express from "express";

import { nanoid } from "nanoid";
import Url from "../models/url.js";

const router = express.Router();

router.post("/shorten",async(req,res)=>{

    try {
        
     const {orignalurl}=req.body;
     if(!orignalurl){
        return res.status(400).json({error:" url is required"});
     }
     try {
        new URL(orignalurl)
     } catch (error) {
        return res.status(400).json({error:"Invalid url"});
     }

     let shortId;
     let exists=true;
     while(exists){
        shortId=nanoid(7);
        exists= await Url.findOne({shortId});

     }
     const url =await Url.create({
        shortId,orignalurl
     });
     res.json({
        shortId:url.shortId,
        shorturl:`${process.env.BASE_URL}/${url.shortId}`,
     })

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"server error"});
    }
})

router.get("/:shortId",async(req,res)=>{
    try {
         const{shortId}=req.params;
         const url=await Url.findOne({shortId});
         if(!url)res.status(404).json({error:"url not found"});
         url.clicks+=1;
         await url.save();
         return res.redirect(url.orignalurl);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"server error"});

    }
})

export default router;