import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    // console.log(req.body);//instead of console.log(req.body) we will save the user in the database

    if(!username || !email || !password || username === "" || email === "" || password === ""){
       next(errorHandler(400,"All fields are required"));
    }

    
    //creating a hashed password
    const hashPassword = bcryptjs.hashSync(password, 10);
    //used database model user from user.model.js
    const newUser = new User({
        username,
        email,
        password: hashPassword
    });
    try{
    await newUser.save();//this will save the new user to databse and waiting for operation to complete. If the operation is successful then it will return the user data else it will return the error

    res.json('signup succesfull');
    }
    catch(error){
       next(error);
   };
};

//signin controller function will be implemented here 
export const signin = async (req, res,next) => {
     const {email, password} = req.body;
        if(!email || !password || email === "" || password === ""){
            next(errorHandler(400,"All fields are required"));//use next to pass the error to the error handler
        }

        try {
            const validUser = await User.findOne({email});//find the user with the email
            if(!validUser){
                return next(errorHandler(404,"wrong  email"));//if user not found then pass the error to the error handler
            }
            const validPassword = bcryptjs.compareSync(password, validUser.password);//compare the password with the hashed password
            if(!validPassword){
                return next(errorHandler(400,"wrong credentials"));//if password is invalid then pass the error to the error handler
            }

            //creating a token for authentication using jwt

            const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});//create a token with email and id of the user and secret key and expiration time of 1 hour

            const {password: pass, ...rest} = validUser._doc;//remove the password from the user data(the hashed one)
            
            res.status(200).cookie('access_token',token,{httponly:true}).json(rest);//return the token to the user
        } catch (error) {
            next(error)
        }
}
     

export const google = async (req, res,next) => {
       const {email, name, googlePhotoUrl} = req.body;
       try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);//generate a random password for the user

            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);//hash the generated password

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
                email,
                password: hashedPassword,
                profilePicture:googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);
        }
       } 
       
       catch(error) {
        next(error);
       }
};