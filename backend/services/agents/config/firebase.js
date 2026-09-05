// var admin = require("firebase-admin");
import { cert } from "firebase-admin/app";
import admin from "firebase-admin";

import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

export const app = admin.initializeApp({
    credential: cert(serviceAccount)
});
