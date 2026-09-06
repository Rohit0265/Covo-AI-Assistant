export const agent = async()=>{
    try {
        const {prompt,conversationId}= req.body

        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{
            conversationId,role:"user",content:prompt
        })

        const result = await graph.invoke({
            prompt,conversationId
        })
        const response = result.aiResponse

        return res.status(200).json(response)

     } catch (error) {
        return res.status(500).josn({message:`agent error ${error}`})
    }
}