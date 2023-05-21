// const mongoose = require('mongoose')
const express = require('express')
const app = express();
const auth = require('./router/auth')
const post = require('./router/post')
const user = require('./router/user')
const conversations = require('./router/conversations')
const messages = require('./router/messages')
const cors = require('cors')
app.use(express.json());
const corsOption = {origins:['http://localhost:5173 ','http://localhost:5175','https://memestagram-one.vercel.app/'],credentials : true}
app.use(cors(corsOption))

const dotenv = require('dotenv')
dotenv.config()

app.get('/',(req, res)=>{
    res.send('sdsd')
})


app.use('/auth',auth)
app.use('/post',post)
app.use('/user',user)
app.use('/conversations',conversations)
app.use('/messages',messages)
app.listen(4000);