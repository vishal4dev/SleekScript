import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';


dotenv.config();
mongoose.connect(process.env.MONGO
).then(()=>{
    console.log("mongodb is connected");
})
.catch((err)=>{
    console.log(err);
})

const app = express();

app.use('/api/user', userRoutes); // Mounting userRoutes at /api/user


app.listen(3000,()=>{
    console.log("Server is up and running on port 3000");
});

