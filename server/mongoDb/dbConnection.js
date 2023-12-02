const mongoose = require("mongoose")
const dbConnect = async (url) => {
    try {
        const connection = await mongoose.connect(url);
        if (connection) {
            console.log("db connected succefully");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={dbConnect};