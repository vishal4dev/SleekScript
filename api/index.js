import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(
'mongodb+srv://vishal:hotblogs@sleekscript.xnjzzvn.mongodb.net/sleekScript?retryWrites=true&w=majority&appName=sleekScript'
).then(()=>{
    console.log("mongodb is connected");
})
.catch((err)=>{
    console.log(err);
})

const app = express();












app.listen(3000,()=>{
    console.log("Server is up and running on port 3000");
});