const router= require("express").Router();
const authMiddleware=require("../middleware/auth")
const { register, login, getAllUsers, updateProfile, getSingleUser } = require("../controllers/userController");


router.post("/register",register);
router.post("/login",login);
router.post("/getAllUsers",authMiddleware,getAllUsers);
router.get("/getSingleUser/:currentUserId",authMiddleware,getSingleUser);
router.put("/updateProfile",authMiddleware,updateProfile);


module.exports=router;