import { Plans } from "../config/Plans"

export const createOrder = async(req,res)=>{
    try {
        const {plan} = req.body
        const userId = req.headers["x-user-id"]
        const selectedPlans = Plans[plan]

        if(!selectedPlans){
            return res.status(404).json({message:"plan not found"})
        }

    } catch (error) {
        
    }
}