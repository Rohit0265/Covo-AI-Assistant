import { S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFARE_S3_KEY,
  credentials: {
    accessKeyId: process.env.CLOUDFARE_ACCESS_ID,
    secretAccessKey: process.env.CLOUDFARE_SECRET_KEY,
  },
});

export default r2;