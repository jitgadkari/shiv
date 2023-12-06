const express= require("express");
const cors = require("cors");
const app =express();
require("dotenv").config();
const Users =require("./models/userModel");
const PORT = process.env.PORT||3333

app.use(express.json());
app.use(cors(
    {
        origin: 'https://shiv-frontend.vercel.app/',
        credentials: true,
      }

));


const {dbConnect}=require("./mongoDb/dbConnection");
dbConnect(process.env.MONGO_URL);
const router=require("./routes/userRoutes");
const postRouter=require("./routes/postRoutes");
const paymentRouter=require("./routes/paymentRoute")
const aboutRouter=require("./routes/aboutRoutes")
app.use("/api/v1/auth",postRouter);
app.use("/api/auth",router);

app.use("",paymentRouter);
app.use("",aboutRouter);
app.use("/",(req,resp)=>{
    
    resp.send("server running");
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT} `);
})