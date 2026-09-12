import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Converstaion"
    },
    role:{
        type:String,
        enum: ["user", "assistant", "assisstant"]
    },
    content:String,
    images:[string]
},{
    timestamps:true
})

const Message = mongoose.model("Message",messageSchema)
export default Message;