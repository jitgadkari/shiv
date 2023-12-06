const Razorpay = require('razorpay');
require("dotenv").config();
const crypto = require('crypto');
const Payment = require('../models/paymentModel');

module.exports.createPayment = async (req, resp, next) => {
  try {
    const amount = req.body.amount;
    const name = req.body.name;
    const contactNum = req.body.contactNum;

    // Initialize Razorpay with your API key and secret key
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Amount in paise (e.g., 50000 paise = ₹500)

    const payment_capture = 1;
    const currency = 'INR';

    const options = {
      amount:Number(amount*100),
      currency,
      receipt: 'receipt_order_123',
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    resp.json({ response,name,contactNum, msg: "payment initiated" });
  } catch (ex) {
    console.error(ex);
    resp.status(500).json({ error: 'Internal Server Error' });
    next(ex);
  }

}

module.exports.paymentVerification = async (req, resp, next) => {
  try {
    // console.log(req.body);
    const calculateHmac = (data, key) => {
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(data);
      return hmac.digest('hex');
    };
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature,name,amount}=req.body;
    generated_signature = calculateHmac(razorpay_order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_SECRET);

    if (generated_signature == razorpay_signature) {

    const paymentData=await Payment.create({
        razorpay_payment_id,razorpay_order_id,razorpay_signature,name,amount:(Number(amount)/100)
      })
      if(paymentData){
        resp.json({status:true,msg:"payment successfull",dbStore:"successfully stored in db"});
      }
    }else{
      resp.json({stats:false,msg:"payment failure",dbStore:"failde to stored in db"})
    }
  } catch (e) {
    next(e)
  }

}

module.exports.razor_key = async (req, resp, next) => {
  try {
    const key = await process.env.RAZORPAY_KEY_ID;

    if (key) {
      resp.json({
        status: true, msg: "found razorpay key", key
      })
    } else {
      resp.json({
        status: false, msg: " couldn't found razorpay key", key
      })

    }

  } catch (ex) {
    next(ex)
  }

}
module.exports.getPaymentDetails = async (req, resp, next) => {
  try {
    const data=await Payment.find().sort({createdAt :-1});
    if (data) {
      resp.json({
        status: true, msg: "payment Details", data
      })
    } else {
      resp.json({
        status: false, msg: " couldn't found payment Details"
      })

    }

  } catch (ex) {
    next(ex)
  }

}
