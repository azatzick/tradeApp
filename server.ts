import express, { Request, Response } from 'express';
import { Stock } from './models/Stock';
import axios from 'axios';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

//TICKERS TO LIST PERIODICALLY 
const tickers = ['AAPL', 'GOOGL', 'TSLA', 'MSFT']; // Add more as needed
app.use(cors({
    origin: 'http://localhost:4200'
  }));

app.use(express.json());

//MONGO 
mongoose.connect('mongodb://localhost:27017/tradeApp', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to mongoDB');
})


//RENDERING REAL-TIME STOCK DATA
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
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
    }
}

// API endpoint to manually fetch a real-time data  data
app.get('/api/stocks', async (req: Request, res: Response) => {
    try {
      // Fetch all stocks sorted by the latest timestamp in descending order
      const stocks = await Stock.find().sort({ timestamp: -1 });
      res.status(200).json(stocks);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ error: 'Failed to fetch stocks' });
    }
  });

// Periodic fetching every minute for multiple stocks
setInterval(() => {
    tickers.forEach((ticker) => {
        fetchStockData(ticker); // Fetch data for each stock ticker
    });
}, 1000); // Fetch every 60 seconds

//HISTORICAL DATA
const fetchHistoricalData = async (ticker: string, range: string = '5y', interval: string = '1mo') => {
    try {
        const response = await axios.get<any>(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
            params: { range, interval },
        });
        return response.data.chart.result[0];
    } catch (error) {
        console.error(`Error fetching historical data for ${ticker}:`, error);
        throw error;
    }
};
//Api endpoint for historical data
app.get('/api/historical/:ticker', async (req: Request, res: Response) => {
    const { ticker } = req.params;
    try {
        const historicalData = await fetchHistoricalData(ticker);
        res.status(200).json(historicalData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});


//TEST
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




