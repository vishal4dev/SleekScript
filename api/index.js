import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
mongoose.connect(process.env.MONGO
).then(()=>{
    console.log("mongodb is connected");
})
.catch((err)=>{
    console.log(err);
})

const app = express();

app.use(express.json());//this allows us to parse the incoming request with JSON payloads 

app.use(cookieParser());
app.use('/api/user', userRoutes); // Mounting userRoutes at /api/user

app.use('/api/auth',authRoutes)

//adding a middleware to handle the error
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

app.listen(3000,()=>{
    console.log("Server is up and running on port 3000");
});

