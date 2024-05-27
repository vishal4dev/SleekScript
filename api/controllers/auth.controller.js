import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);//instead of console.log(req.body) we will save the user in the database

    if(!username || !email || !password || username === "" || email === "" || password === ""){
        return res.status(400).json({
            error: "All fields are required"
        })
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
    catch(err){
        return res.status(400).json({message:err.message});
    }
};
    
