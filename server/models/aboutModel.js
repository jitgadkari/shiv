const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    title: {
        type: String,
    },
    slides:[
        {
            photo:{type:String}
        }
    ]
    ,
    members:[
        {
            name:{type:String},
            profile:{
                type:String
            }
        }
    ]
    
      
},{
    timestamps:true
})


const About=mongoose.model("About", aboutSchema);
module.exports = About;