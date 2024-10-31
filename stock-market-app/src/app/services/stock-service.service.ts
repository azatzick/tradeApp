import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  
  private apiUrl = 'http://localhost:8000/api/stocks';
  private HapiUrl = 'http://localhost:8000/api/historical'
 


  async getLiveStockData(): Promise<StockData[]> {
    try {
      const response = await axios.get<StockData[]>(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }

  async getHistoricalData(ticker: string): Promise<HistoricalDataResponse | null> {
    try {
      const response = await axios.get<HistoricalDataResponse>(`${this.HapiUrl}/${ticker}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${ticker}:`, error);
      return null;
    }
  }

}

export interface StockData{
  ticker:string;
  price:number;
  timestamp:Date;
}

interface HistoricalDataResponse {
  meta: {
    currency: string;
    symbol: string;
    exchangeName: string;
    // add other meta fields if necessary
  };
  timestamp: number[]; // Array of timestamps
  indicators: {
    quote: {
      close: number[]; // Array of closing prices
    }[];
  };
}
  
