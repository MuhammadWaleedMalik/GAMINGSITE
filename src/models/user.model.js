import mongoose from "mongoose";

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const UserSchema=new mongoose.Schema(
    {
    username:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,'Password is Required'],

    },
    
},
{
 timestamps:true   
}
)

UserSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next()

    this.password=await bcrypt.hash(this.password,10)
    next()

})

UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username, 
        },
        process.env.ACCESS_TOKEN_SECRET,
    
    )
}




export const User=mongoose.model('User',UserSchema)