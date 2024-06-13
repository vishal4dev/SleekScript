import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.models.js";


export const test = (req, res) => {
  res.send(
       "api is working"
  );
};

//before update we want the user to be autheticated so we will use the middleware to authenticate the user
//so we will take data from the browser cookies and then we will check if the token is valid or not
export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to update this user"));
    }
    if(req.body.password){
        if(req.body.password.length <6){
            return next(errorHandler(400,"Password must be at least 6 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400,"Username must be between 7 to 20 characters"));
        }

        if(req.body.username.includes(" ")){
            return next(errorHandler(400,"Username must not contain spaces"));
        }

        if(req.body.username !==req.body.username.toLowerCase()){
            return next(errorHandler(400,"Username must be in lowercase"));
        }
        if(!req.body.username.match(/^[0-9a-zA-Z]+$/)){
            return next(errorHandler(400,"Username must contain only letters and numbers"));
        }
    }

        try{
             const updatedUser = await User.  findByIdAndUpdate(req.params.userId, {
                //this is a bad practice to update the user using req.body because the user can update any field of the user
                $set:{
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture:req.body.profilePicture,
                    password:req.body.password,
                },
            },{new:true});//this will make sure the updated user is returned and not the old one
            const {password, ...rest} = updatedUser._doc;

                
            res.status(200).json(rest);
        }
        catch(error){
            next(error);
        }
    

};