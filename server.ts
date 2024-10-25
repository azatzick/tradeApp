import express, { Request, Response } from 'express';
import { Stock } from './models/Stock';
import axios from 'axios';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8000;

//TICKERS TO LIST PERIODICALLY 
const tickers = ['AAPL', 'GOOGL', 'TSLA', 'MSFT']; // Add more as needed

app.use(express.json());

//MONGO 
mongoose.connect('mongodb://localhost:27017/tradeApp', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to mongoDB');
})

const fetchStockData = async (ticker: string) => {
    try {
        const response = await axios.get<any>(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
            params: {
                interval: '1m',
                range: '1d'
            },
        });
        const price = response.data.chart.result[0].meta.regularMarketPrice;
        const stock = new Stock({
            ticker: ticker,
            price: price
        });
        await stock.save();
        console.log(`Fetched and saved data for ${ticker}: ${price}`);
        console.log(`Price for ${ticker}: ${price}`);
        console.log(`Stock object:`, stock);

    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
    }
}



// API endpoint to manually fetch a stock's data
app.get('/api/stocks/:ticker', async (req: Request, res: Response) => {
    const ticker: string = req.params.ticker;

    try {
        await fetchStockData(ticker);
        res.status(200).json({ message: `Fetched data for ${ticker}` });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Periodic fetching every minute for multiple stocks
setInterval(() => {
    tickers.forEach((ticker) => {
        fetchStockData(ticker); // Fetch data for each stock ticker
    });
}, 10000); // Fetch every 60 seconds

//TEST
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




