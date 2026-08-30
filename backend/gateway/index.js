import express from "express"
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use("/auth",proxy(process.env.AUTH_SERVICE_URL));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
}); 