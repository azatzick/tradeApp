import mongoose from "mongoose";

 const stockSchema = new mongoose.Schema({
    ticker:String,
    price:Number,
    timestamp:{type:Date, default:Date.now}
});

export const Stock = mongoose.model('Stock', stockSchema); 