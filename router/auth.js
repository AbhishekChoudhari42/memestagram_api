const express = require('express')
const router = express.Router()
const {asyncError,errorHandler} = require('../utils/errorHandler')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const dbconn = require('../utils/dbconn')
const {generateToken,generateRefreshToken} = require('../utils/cookiefunctions')

router.post("/register",asyncError(async(req,res) => {

    const
    {name,email,password} = req.body;
    
    await dbconn();
    
    let user = await User.findOne({email:email})

    if(!name || !email || !password ) return errorHandler(res,401,"Enter all the fields data")

    if(user) return errorHandler(res,401,"user already registered with this username")
    
    const hashedPassword = await bcrypt.hash(password,10)
    
    user = await User.create({name:name,email:email,password:hashedPassword})

    const userId = user._id

    const token = generateToken(userId)
    const refreshToken = generateRefreshToken(userId)

    res.status(200).json({success:true,message:"Registered Successfully"})

}))


router.post("/login",asyncError(async(req,res) => {

    await dbconn();

    let {email, password} = req.body;

    if(!email || !password ) return errorHandler(res,401,"Enter all the fields data")

    let user = await User.findOne({email}).select("+password")

    if(!user) return errorHandler(res,401,"Invalid email or password")
    
    const authStatus = await bcrypt.compare(password,user.password)

    
    if(!authStatus) return errorHandler(res,401,"Invalid email or password")

    const userId = user._id

    const accessToken = generateToken(userId)
    const refreshToken = generateRefreshToken(userId)

    res.status(200).json(
        {
            success:true,
            user:{
                userName : user.name,
                userId:user._id,
                accessToken,
                refreshToken
            }
        }
    )

}))

let refreshTokens = []

router.post('/refresh',(req,res)=>{
    const refreshToken = req.body.token

    if(!refreshToken){
        return res.status(401).json("You are not Authenticated");
    }

    if(refreshTokens.includes(refreshToken)){
        jwt.verify(refreshToken,"refreshSecret",(err,userId)=>{
            err && console.log(err);
                refreshTokens = refreshTokens.filter((token)=>{token !== refreshToken})

                const newAccessToken = generateToken(userId)
                const newRefreshToken = generateRefreshToken(userId)
                
                refreshTokens.push(newRefreshToken)
            
                res.status(200).json({refreshToken : newRefreshToken,accessToken:newAccessToken})
            })
    }
})

router.get('/logout',asyncError(async(req,res) => {

    res.status(200).json({success:true,message:"Logged Out Successfully"})

}))

module.exports = router