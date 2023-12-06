const { createPayment, razor_key, paymentVerification,getPaymentDetails } = require('../controllers/paymentController');
const express=require("express");
const paymentRouter=express.Router();


paymentRouter.post("/api/payment",createPayment);
paymentRouter.post("/api/paymentVerification",paymentVerification);
paymentRouter.get("/api/key",razor_key);
paymentRouter.get("/api/paymentDetails",getPaymentDetails);


module.exports= paymentRouter;