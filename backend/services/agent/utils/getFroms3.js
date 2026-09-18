import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2 from "./config/r2.js";

export const getFiles = async (filename,expiresIn=600) => {
    return await getSignedUrl(
        r2,
        new GetObjectCommand({
            Bucket: process.env.CLOUDFARE_NAME,
            Key: filename,
        }),
        { expiresIn }
    );
}