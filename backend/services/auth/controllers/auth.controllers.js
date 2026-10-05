// ```js
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/users.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
    try {
        const token = req.body.token;

        const decoded = await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                username: decoded.name || decoded.email,
                email: decoded.email,
                avatar: decoded.picture
            });
        }

        const sessionId = crypto.randomUUID();

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user._id,
                name: user.username || user.name || user.email,
                email: user.email,
                avatar: user.avatar
            }),
            "EX",
            7 * 24 * 60 * 60
        );

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `login error ${error}`
        });
    }
};


export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.session;

        await redis.del(`session:${sessionId}`);

        res.clearCookie("session");

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: `logout error ${error}`
        });
    }
};


export const updateUserPayment = async(req, res) =>{
    try {
        const {credits, userId, sessionId} = req.body
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        
        user.credits = (user.credits || 0) + credits;
        user.totalcredits = (user.totalcredits || 0) + credits;
        await user.save();

        if (sessionId) {
            await redis.set(
                `session:${sessionId}`,
                JSON.stringify({
                    userId: user._id,
                    name: user.username || user.name,
                    email: user.email,
                    avatar: user.avatar,
                    plan: user.plan,
                    credits: user.credits,
                    totalcredits: user.totalcredits,
                    planExpireAt: user.planExpireAt
                }),
                "EX",
                7 * 24 * 60 * 60
            );
        }
        
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(400).json({message:`error in payment ${error}`})
    }
}

// ```
