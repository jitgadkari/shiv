const Posts = require("../models/postModel");


module.exports.createPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const { caption, photo } = req.body;
    if (!caption || !photo) {
      return res.json({
        status: false, msg: "could not recieve data from frontend,provide title and body"
      })
    }

    const createPost = new Posts({
      caption,
      photo,
      postedBy: req.user
    })

    const post = await createPost.save();
    return res.json({
      status: true, msg: "recieved post data successfully ", post
    })
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
}


module.exports.getAllPost = async (req, resp, next) => {
  try {
    const allPosts = await Posts.find().populate("postedBy", "_id username profilePic").populate("comments.commentBy", "_id username profilePic");
    resp.json(allPosts)

  } catch (ex) {
    next(ex)
  }
}

module.exports.getMyPosts = async (req, resp, next) => {
  try {
    const myPosts = await Posts.find({ postedBy: req.user._id }).populate("postedBy", "_id username profilePic").populate("comments.commentBy", "_id username profilePic");;
    if (!myPosts) {
      resp.json({
        status: failed, msg: "no Posts available or failed to get posts", myPosts
      })
    }
    resp.json({
      status: true, msg: "fetched myPosts successfully", myPosts
    })
  } catch (ex) {
    next(ex)
  }
}


module.exports.like = async (req, resp, next) => {
  try {
    const postId = req.body.postId;
    const result = await Posts.findByIdAndUpdate(postId, { $push: { likes: req.user._id } })
    if (result) {
      resp.json({ status: true, msg: "successfully liked the post", result });
    } else {
      resp.json({ status: false, msg: "failed to like post", result })
    }
  } catch (ex) {
    next(ex);
  }
}
module.exports.unlike = async (req, resp, next) => {
  try {
    const postId = req.body.postId;
    console.log(postId);
    const result = await Posts.findByIdAndUpdate(postId, { $pull: { likes: req.user._id } })
    if (result) {
      resp.json({ status: true, msg: "successfully unliked the post", result });
    } else {
      resp.json({ status: false, msg: "failed to unlike post", result })
    }
  } catch (ex) {
    next(ex);
  }
}
module.exports.comment = async (req, resp, next) => {
  try {
    const postId = req.body.postId;
    console.log(postId);
    const result = await Posts.findByIdAndUpdate(postId, {
      $push: {
        comments: {
          comment:
            req.body.comment
          ,
          commentBy: req.user._id
        }
      }
    })
    if (result) {
      resp.json({ status: true, msg: "comment successfull", result });
    } else {
      resp.json({ status: false, msg: "failed to comment", result })
    }
  } catch (ex) {
    next(ex);
  }
}
module.exports.deletePost = async (req, resp, next) => {
  try {
    const postId = req.params.postId;

    const result = await Posts.findByIdAndDelete(postId)
    if (result) {
      resp.json({ status: true, msg: "deleted Post successfully", result });
    } else {
      resp.json({ status: false, msg: "failed to delete Post", result })
    }
  } catch (ex) {
    next(ex);
  }
}
module.exports.deleteComment = async (req, resp, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    console.log(postId,commentId)
    const foundPost = await Posts.findById(postId);
    if (foundPost) {
      const foundComment = foundPost.comments.find(comment => comment._id.toString() === commentId);
      if (!foundComment) {
        resp.json({ status: false, msg: "Could not found Comment" });
      }
      if (foundComment.commentBy.toString() === req.user._id.toString()) {
        foundPost.comments = foundPost.comments.filter(comment => comment._id.toString() !== commentId);
        const result = await foundPost.save();
        resp.json({ status: true, msg: "Comment deleted successfully", result });
      }

      if (foundComment.commentBy.toString() !== req.user._id.toString()) {
        resp.json({ status: false, msg: "Unauthorised :You cannot delete the comment" });
      }
    } else {
      resp.json({ status: false, msg: "Post not found" })
    }
  } catch (ex) {
    next(ex);
  }
}
