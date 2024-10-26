import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  
  private apiUrl = 'http://localhost:8000/api/stocks';


  async getStockData(): Promise<StockData[]> {
    try {
      const response = await axios.get<StockData[]>(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }

}

export interface StockData{
  ticker:string;
  price:number;
  timestamp:Date;
}
  
