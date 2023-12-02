const { createPost, getAllPost, getMyPosts, like, unlike, comment, deletePost, deleteComment,  } = require("../controllers/postController");


const postRouter=require("express").Router();
const authMiddleware=require("../middleware/auth")

postRouter.post("/createPost",authMiddleware,createPost);
postRouter.get("/getAllPost",getAllPost);


postRouter.get("/getMyPost",authMiddleware,getMyPosts);

postRouter.put("/like",authMiddleware,like);

postRouter.put("/unlike",authMiddleware,unlike);
postRouter.put("/comment",authMiddleware,comment);
postRouter.delete("/deleteComment/:postId/:commentId",authMiddleware,deleteComment);
postRouter.delete("/delete/:postId",deletePost);

module.exports= postRouter;
