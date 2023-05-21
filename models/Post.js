const mongoose =  require("mongoose");

const schema = new mongoose.Schema({
title:{
    type : String,
    required: true,
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
},
username:{
    type:String,
    required: true
},
imageURL:{
    type:String,
    required: true
},
createdAt:{
    type:Date,
    default:Date.now
},
likes:{
    type:Array,
    default:[]
}



})

module.exports = mongoose.models.Post  || mongoose.model("Post",schema)