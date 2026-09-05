import Message from "../model/message.model"

export const createConversation= async(req,res)=>{
    try {
        const userId = req.headers["x-user-id"]
        console.log("userId",userId)
        const conversation= await conversation.create({
            userId:userId
        })
        return res.status(200).json(conversation)
    } catch (error) {
         return res(300).json(error)
    }
}


export const getConversations = async(req,res)=>{
    try {
        const userId = req.headers["x-user-id"]
        console.log("userId",userId)
        const conversation= await conversation.find({
            userId:userId
        }).sort({updateAt:-1})
        return res.status(200).json(conversation)
    } catch (error) {
         return res(300).json(`get conversations error ${error}`)
    }
}


export const updateConversations = async(req,res)=>{
    try {
        const {id,title}= req.body
        const conversation= await conversation.findByIdAndUpdate(id,{
            title
        })
        return res.status(200).json(conversation)
    } catch (error) {
         return res(300).json(`get conversations error ${error}`)
    }
}


export const saveMessages = async()=>{
    try {
        const {conversationId,role,content} = req.body;
        const message = await Message.create({
            conversationId,
            content,
            role
        })
        return res.status(200).json(message)
    } catch (error) {
          return res.status(300).json(`error in saving message ${error}`)      
    }
}


export const getMessages = async()=>{
    try {
        // const {conversationId} = req.body;
        const message = await Message.find({
            conversationId:req.params.conversationId,
        }).sort({updatedAt:-1})
        return res.status(200).json(message)
    } catch (error) {
          return res.status(300).json(`error in finding message ${error}`)      
    }
}