import { Plans } from "../config/Plans.js"
import razorpay from "../config/razorpay.js"
import Payment from "../models/payment.models.js"
import axios from "axios"

export const createOrder = async(req,res)=>{
    try {
        const { plan } = req.body;
        const userId = req.headers["x-user-id"];
        const selectedPlan = Plans[plan];

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!selectedPlan || selectedPlan.amount <= 0) {
            return res.status(400).json({ message: "A paid plan is required" });
        }
        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency:"INR",
            receipt:`receipt-${Date.now()}`
        })

        await Payment.create({
            userId,
            orderId:order.id,
            amount:selectedPlan.amount,
            credits:selectedPlan.credits,
            plan:selectedPlan.id,
            currency:order.currency,
            status:"pending"
        })

        return res.status(200).json({
            order,
            plan: selectedPlan,
            keyId: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        return res.status(500).json({message:`create order eror ${error}`})
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        } = req.body
        const generateSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET_ID)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

        if(generateSignature !== razorpay_signature){
            return res.status(400).json({message:"Payment Verification Failed"})
        }

        const payment = await Payment.findOne({orderId:razorpay_order_id})

        if(!payment){
                 return res.status(404).json({message:"Payment Not Found"})       
        }

        if (payment.status === "paid") {
            return res.status(200).json({ message: "Payment already verified" });
        }

        const { data: accountUpdate } = await axios.post(
            `${process.env.AUTH_SERVICE}/update-plan`,
            { userId: payment.userId, plan: payment.plan, credits: payment.credits },
            { headers: { "x-session-id": req.headers["x-session-id"] } }
        );

        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;
        await payment.save();

        return res.status(200).json({ message: "Payment Verified", user: accountUpdate.user });
    } catch (error) {
        return res.status(400).json({message:`payment error ${error}`})
    }
}
