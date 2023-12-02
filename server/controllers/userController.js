const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

module.exports.register = async (req, resp, next) => {
  try {
    const { username, email, password } = req.body;

    const checkUsername = await Users.findOne({ username });
    if (checkUsername) {
      return resp.json({
        status: false, msg: "username already exist"
      })
    }
    const checkEmail = await Users.findOne({ email });
    if (checkEmail) {
      return resp.json({
        status: false, msg: "email already exist"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await Users.create(
      {
        username,
        email,
        password: hashPassword
      }
    )

    //create token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verifyResult = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifyResult:", verifyResult)
    delete user.password;
    return resp.json({
      status: true, msg: "successfully registered in db", user, token
    })
  } catch (ex) {
    next(ex);
    console.log(ex);
  }
}
module.exports.login = async (req, resp, next) => {
  try {
    const { username, password } = req.body;

    const checkUser = await Users.findOne({ username });
    if (!checkUser) {
      return resp.json({
        status: false, msg: "incorrect username"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return resp.json({
        status: false, msg: "incorrect username or password"
      })
    }
    //create token 
    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const verifyResult = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifyResult:", verifyResult)
    delete checkUser.password;
    return resp.json({
      status: true, msg: "successfully registered in db", checkUser, token
    })
  } catch (ex) {
    next(ex);
    console.log(ex);
  }
}

module.exports.getAllUsers = async (req, resp, next) => {
  try {
    const { currentUserId } = req.body;

    const allUsers = await Users.find({ _id: { $ne: currentUserId } }).select(["username", "email", "_id"]);
    if (!allUsers) {
      return resp.json({
        status: false, msg: "could not found users"
      })
    }

    return resp.json({
      status: true, msg: "fetched all the users ", allUsers
    })
  } catch (ex) {
    next(ex);
    console.log(ex);
  }
}
module.exports.getSingleUser = async (req, resp, next) => {
  try {
    const  currentUserId  = req.params.currentUserId;
    console.log(currentUserId)
    const currentUser = await Users.find({ _id: currentUserId });
    if (!currentUser) {
      return resp.json({
        status: false, msg: "could not found user"
      })
    }

    return resp.json({
      status: true, msg: "fetched the current user ", currentUser
    })
  } catch (ex) {
    next(ex);
    console.log(ex);
  }
}

module.exports.updateProfile = async (req, resp, next) => {
  try {
    const currentUserId = req.user;//comming from auth middleware
    const result = await Users.findByIdAndUpdate(currentUserId, { $set: { profilePic: req.body.photo } },
      { new: true })
    if (result) {
      resp.json({ status: true, msg: "updated profile successfully", result });
    } else {
      resp.json({ status: false, msg: "failed to update profile", result })
    }
  } catch (ex) {
    next(ex);
  }
}