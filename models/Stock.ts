import mongoose from "mongoose";

 const stockSchema = new mongoose.Schema({
    ticker:String,
    price:Number,
    timestamp:{type:Date, default:Date.now},
    interval: String, // e.g., '1d', '1wk', '1mo'
});

export const Stock = mongoose.model('Stock', stockSchema); 