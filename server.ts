import express, { Request, Response } from 'express';
import axios from 'axios';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 8000; 

app.use(express.json());

//Connecting to Yahoo Finance for live stock prices
app.get('/api/stocks/ticker', async (req:Request, res: Response)=> {
    const ticker: string = req.params.ticker;
    try{
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`,{
            params: {
                interval: '1m',
                range: '1d'
            },
        });
        res.json(response.data);
    }catch(error){
        console.error('Error fetching stock data', error);
        res.status(500).json({error: 'Failed to fetch stock data'});
    }
})

//Establishing mongoDB connection
mongoose.connect('mongodb://localhost:27017/tradeApp', {
}).then(() =>{
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to mongo');

})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});