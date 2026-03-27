const usermodel = require('../model/usermodel')
const bcrypt = require('bcryptjs')

// user registration
// http://localhost:4646/api/register
const registeruser= async(req,res)=>{
    try{
        // let data = req.body;
        // we are reading data from req.body
        let {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({error: 'username, password and email are required'})
        }

        let user = await usermodel.findOne({email});
        if(user){
            return res.status(400).json({error: 'user already exist'})
        }

        req.body.password=await bcrypt.hash(password, 10);
        let newuser = new usermodel(req.body);
        await newuser.save();
        res.status(200).json({message:"user registered successfully", user:newuser})

        // res.status(200).json({message:"API Under Construction", data})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

// user login
// http://localhost:4646/api/login
const login = async(req, res)=>{
    try{
        // getting email and password from req.body
        const {email, password} = req.body;
        // check if email and password entered/typed or not
        if(!email || !password){
            return res.status(400).json({error:'email and password required'})
        }

        // return user's email from mongodb and store in variable
        let user = await usermodel.findOne({email});
        // checking if user exist
        if(!user){
            return res.status(400).json({error: 'user not found!'})
        }

        // comparing password using bcrypt.compare because pass is hashed
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({error: 'password mismatch'})
        }

        res.status(200).json({message: "user logged in successfully", user:user})

    }catch(error){
        res.status(500).json({error:'Internal Server Error'})
    }
}


// get one user by email
// http://localhost:4646/api/getuserbyemail/<email>
const getuserbyemail = async(req, res)=>{
    try{
        const email = req.params.email;
        // if user didnt send us email
        if(!email){
            return res.status(400).json({error: 'email is required'});
        }

        // if there is no record with email
        const user = await usermodel.findOne({email}).select('-password')
        if(!user){
            return res.status(404).json({error: 'this email does not exist'})
        }
        return res.status(200).json({message: 'user fetched', user:user})

    }catch(error){
        return res.status(500).json({error: 'internal server error', error:error})
    }
}

// update user by id
// http://localhost:4646/api/updateuser/<user id>
const updateuser = async(req, res)=>{
    try{
        // getting id from params meaning from user it will appear in url bar
        const id = req.params.id;
        // if user didnt typed/given id
        if(!id){
            return res.status(400).json({error: 'id is required'})
        }
        // await makes this synchornous
        // find user by id and update body (but it do not update id).
        const user = await usermodel.findOneAndUpdate({_id:id}, req.body,{new:true});
        if(!user){
            return res.status(404).json({error: 'user not found'})
        }
        return res.status(200).json({message:'user updated successfully', user:user})
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'internal server error'})
    }
}

// delete user by id
// http://localhost:4646/api/deleteuser/<id>
const deleteuser = async(req, res)=>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({error: "id is required"});
        }
        // awaits makes it wait and doesnot let it to jump to next task
        const deleteduser = await usermodel.findByIdAndDelete(id);

        if(!deleteduser){
            return res.status(404).json({error: "delete failed user not found"})
        }
        return res.status(200).json({message: "user successfully deleted", user:deleteduser})
    }catch(error){
        return res.status(500).json({error: "internal server error"})
    }
}
module.exports = {registeruser, login, getuserbyemail, updateuser, deleteuser};