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
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpireAt: user.planExpireAt
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


export const updateUserPayment = async(req, res) => {
    try {
        const { plan, credits, userId } = req.body;
        const creditAmount = Number(credits);

        if (!userId || !Number.isFinite(creditAmount) || creditAmount <= 0) {
            return res.status(400).json({ message: "A valid user and credit amount are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.plan = plan || user.plan;
        user.credits += creditAmount;
        user.totalCredits += creditAmount;
        user.planExpireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();

        // The billing service receives this from the authenticated gateway request.
        // Refreshing it keeps /api/me accurate immediately after a purchase.
        const sessionId = req.headers["x-session-id"] || req.cookies?.session;
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
                totalCredits: user.totalCredits,
                planExpireAt: user.planExpireAt
                }),
                "EX",
                7 * 24 * 60 * 60
            );
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: `error in payment ${error.message}` });
    }
}

// ```
