const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const User = require('../models/User')

const generateToken = (userId) =>{
    return jwt.sign({userId},"secret",{expiresIn:"600m"})
}

const generateRefreshToken = (userId) =>{
    return jwt.sign({userId},"refreshSecret",{expiresIn:"20m"})
}


const verify = (req,res,next) =>{

    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader;
        jwt.verify(token,"secret",(err,userId)=>{
            if(err){
                return res.status(403).json("Token is not valid")
            }
            req.userId = userId
            next()
        })
    }else{
        res.status(401).json("you are not authenticated")
    }
}

module.exports = {verify,generateToken,generateRefreshToken}