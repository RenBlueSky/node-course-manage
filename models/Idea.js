const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    }
})

mongoose.model("ideas",courseSchema);