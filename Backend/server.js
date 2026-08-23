import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from './Routes/url.js';
dotenv.config();

const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT"],
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("URL shortener API is running");
});
app.use("/",urlRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("database connected");
    app.listen(process.env.PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
 console.error("error connecting to mongodb:",err);
});
