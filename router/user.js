const express = require('express')
const router = express.Router()
const {asyncError,errorHandler} = require('../utils/errorHandler')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const dbconn = require('../utils/dbconn')
const mongoose = require('mongoose')
const {verify} = require('../utils/cookiefunctions')

router.get("/checkauthstatus",verify,asyncError(async(req,res) => {

    await dbconn();
    
    let user = await User.findById({_id:userId.userId})
   
    res.status(200).json({user:user._id});
}))



module.exports = router