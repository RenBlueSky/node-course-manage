const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 模型
const User = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
// user ——》表 
mongoose.model("user",User);