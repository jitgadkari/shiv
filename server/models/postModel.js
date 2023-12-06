const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "no photo"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    comments: [
        {
            comment: {
                type: String,
                required: true
            },
            commentBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            }
        }
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
    {
        timestamps: true
    });


const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;