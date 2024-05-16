import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
},
    {timestamps:true}//this will automatically add the created time and updated time of the data fields
);

//after creating the schema we need to create a model
const User = mongoose.model('User',userSchema);

export default User;

