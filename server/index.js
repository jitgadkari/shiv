const express= require("express");
const cors = require("cors");
const app =express();
require("dotenv").config();
const Users =require("./models/userModel");

app.use(express.json());
app.use(cors({
    origin: 'https://shiv-frontend-vbev-7tpqte1hu-ajit-gadkaris-projects.vercel.app',
    credentials: true,
  }));
const {dbConnect}=require("./mongoDb/dbConnection");
dbConnect(process.env.MONGO_URL);
const router=require("./routes/userRoutes");
const postRouter=require("./routes/postRoutes");

const paymentRouter=require("./routes/paymentRoute")
app.use("/api/v1/auth",postRouter);
app.use("/api/auth",router);

app.use("",paymentRouter);

app.listen(3333,()=>{
    console.log("listening on port 3333");
})