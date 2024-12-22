import {asyncHandler }from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'






const generateAccessTokens = async(userId)=>{

    try {
    const user = await User.findById(userId)    
    const accessToken = user.generateAccessToken()

    await user.save({validateBeforeSave:false})
    return {accessToken}
    
    } catch (error) {
        throw new ApiError(500,'Something went wrong while access token')
    }
}


const registerUser=asyncHandler( async (req,res)=>{

const {username,email,password} = req.body

if (
    [email,username,password].some((field)=>{
        return field?.trim() === ''
    })
) {
    throw new ApiError(400,"All Field Are Required")
}

const existedUser =await User.findOne({
    $or:[ { username } ,{ email }]
})

if(existedUser){
    throw new ApiError(409 , "User with email of Username or Email already exists")
}


const user = await User.create(
    {
        username,
        email,
        password,

    }
)

const createdUser = await User.findById(user._id).select("-password")

if(!createdUser){
    throw new ApiError(500,"Sorry Something went Wrong while creating the user")
}

return res.status(201).json(new ApiResponse(200,createdUser,"User Regsitered Successfully"))



})

 
const loginUser=asyncHandler(async (req,res)=>{

const {email,username,password} = req.body;


if(!username && !email){
    throw new ApiError(400,'Username or Password is Required')
}

const user = await User.findOne({ 
    $or:[{email},{username}]
 })

 if(!user){
    throw new ApiError(404,"User Does Not Exit")
 }
 
 const isPasswordValid = await user.isPasswordCorrect(password)
// console.log(isPasswordValid)
 if(!isPasswordValid){
    throw new ApiError(401,'Invalid User Credentials')
 }
 
 const {accessToken} = await generateAccessTokens(user._id)
 
 const loggedInUser = User.findById(user._id).select("-password")

 const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};


 return res.
 status(200)
 .cookie('accessToken',accessToken,options)
 .json(
    new ApiResponse(200,
        JSON.stringify({
            user: loggedInUser,
            accessToken
        }, (key, value) => {
            if (typeof value === 'object' && value !== null) {
             return undefined;
            }
            return value;
        }),
       "User Logged In Successfully")
 )

})


const logoutUser = asyncHandler(async(req,res)=>{
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
 
 res
 .status(200)
 .clearCookie('accessToken',options)
 .json(new ApiResponse(200,{},"User Logged Out Successfully"))
   
})



const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found",
        });
    }

    return res.json(
        new ApiResponse(
            200,
            { user  },
            "User Logged In Successfully"
        )
    );
});







export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
}

