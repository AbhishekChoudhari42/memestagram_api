const mongoose =  require("mongoose");

const schema = new mongoose.Schema({

parentId:{
    type : String
},
comment:{
    type : String,
    required: true,
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
},
username:{
    type:String,
},
postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
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

module.exports = mongoose.models.Comment  || mongoose.model("Comment",schema)