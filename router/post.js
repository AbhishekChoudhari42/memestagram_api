const express = require('express')
const router = express.Router()
const {asyncError,errorHandler} = require('../utils/errorHandler')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')
const dbconn = require('../utils/dbconn')
const {verify} = require('../utils/cookiefunctions')
const jwt = require('jsonwebtoken')

router.get("/myposts",verify,asyncError(async(req,res) => {
    
    await dbconn();
    let userId = req.userId
    let user = await User.findById({_id:userId.userId})
    
    let posts = await Post.find({
        user:user._id
    }).sort({ 'createdAt': -1 })

    res.json({
        success: true,
        posts
    })
    
}))

router.get("/allposts",verify,asyncError(async(req,res) => {
    
    await dbconn();

    let userId = req.userId
    let user = await User.findById({_id:userId.userId})
    
    
    if(!user) return errorHandler(res,401,"Please Login first")
    
    let posts = await Post.find({}).sort({ 'createdAt': -1 })

    res.json({
        success: true,
        posts
    })
    
}))


router.post("/createpost",verify,asyncError(async(req,res) => {

    await dbconn();

    let {title,imageURL} = req.body
    let userId = req.userId
    let user = await User.findById({_id:userId.userId})
    
    
    await Post.create({
        title:title,
        user:user._id,
        username:user.name,
        imageURL:imageURL
    })

    res.json({
        success: true,
        message:"Post Created"
    })

}))

router.delete("/delete/:id",verify,asyncError(async(req,res) => {
    
    await dbconn();

    let userId = req.userId
    let user = await User.findById({_id:userId.userId})

    let postID = req.params.id
    let post  = await Post.findById(postID)

    if(!post) return errorHandler(res,401,"Post not found")

    if(!post.user.equals(user._id)) return errorHandler(res,401,"Please Login")

    await Post.findByIdAndRemove(postID,{
        title:req.body.title
    })



    res.json({
        success: true,
        message:"Post Deleted"
    })
    
}))

router.put("/update/:id",verify,asyncError(async(req,res) => {
    
    await dbconn();


    let userId = req.userId
    let user = await User.findById({_id:userId.userId})

    let postID = req.params.id
    let post  = await Post.findById(postID)

    if(!post) return errorHandler(res,401,"Post not found")

    if(!post.user.equals(user._id)) return errorHandler(res,401,"Please Login")

    await Post.findByIdAndUpdate(postID,{
        title:req.body.title
    })



    res.json({
        success: true,
        message:"Post Updated"
    })

    

    
    
}))



// likePost

router.put("/likepost/:status",verify,asyncError(async(req,res) => {
    
    await dbconn();


    let userId = req.userId
    let user = await User.findById({_id:userId.userId})

    let postId = req.body.postId
    let post  = await Post.findById(postId)

    let status = req.params.status

    if(status === 'like'){
        
        await Post.findByIdAndUpdate(postId,{
            $push:{likes : `${user._id}`}
        })

        let updatedPost = await Post.findById(postId)

        res.status(200).json({status:true, likes : updatedPost.likes.length})


    }else if(status === 'unlike'){
        const updatedLikesArray = post.likes.filter(element=>{return element != `${user._id}`})
        await Post.findByIdAndUpdate(postId,{
            likes : updatedLikesArray
        })
        res.status(200).json({status:false,likes:updatedLikesArray.length})

    }


    
    
}))

router.post("/comment",verify,asyncError(async (req,res)=>{
    let userId = req.userId
    let postId = req.body.postId
    let comment = req.body.comment

    await dbconn();
    

    let user = await User.findById({_id:userId.userId})
    
    await Comment.create({
        userId : userId.userId,
        postId : postId,
        comment : comment,
        username : user.name
    })

    res.status(200).json({success:true})

}))

router.get("/getcomments/:postId",verify,asyncError(async (req,res)=>{
    let userId = req.userId
    let postId = req.params.postId

    await dbconn();
    
    let comments = await Comment.find({
        userId : userId.userId,
        postId : postId,
    }).sort({ 'createdAt': -1 })

    res.status(200).json({success:true,comments})

}))


module.exports = router