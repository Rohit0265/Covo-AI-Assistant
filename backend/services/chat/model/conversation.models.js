import mongoose from "mongoose";

const conversationSChema = new mongoose.Schema({
    title:{
        type:String,
        default:"New Chat"
    },
    userId:{
        type:String
    }
},{
    timestamps:true
})


const conversation = mongoose.model("conversation",conversationSChema)

export default conversation;