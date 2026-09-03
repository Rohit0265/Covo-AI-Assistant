import { getAuth } from "firebase-admin/auth";
import {app} from "../config/firebase.js";
import User from "../models/users.model.js";

export const login = async(req,res)=>{
    try {
        const token = await req.body.token;
        const decoded = await getAuth(app).verifyIdToken(token);
        const user = await User.findOne({     
            firebaseUId: decoded.uid
        });
        if(!user){
            const user = await user.create({
                firebaseUId: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                Avatar: decoded.picture
            })

        }

        const sessionId = crypto.randomUUID();

        res.cookie('session', sessionId, {
            httpOnly: true,
            secure:true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` });
    }
}