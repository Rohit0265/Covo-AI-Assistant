const getCurrentUser = async(req,res)=>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'ni mila user'})
    }
}
export default getCurrentUser;