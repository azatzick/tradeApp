import { Component, OnInit } from '@angular/core';
import { StockService, StockData } from '../../services/stock-service.service';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-stock-display',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './stock-display.component.html',
  styleUrls: ['./stock-display.component.scss']
})
export class StockDisplayComponent implements OnInit {
  stockData: StockData[] = [];
  

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.fetchStockData();
    setInterval(() => {
      this.fetchStockData();
    }, 1000); // Fetch data every 10 seconds
  }

  async fetchStockData() {
    const data = await this.stockService.getLiveStockData();
    
    const uniqueStocks = new Map<string, StockData>();
    data.forEach(stock => {
      // For each ticker, store only the latest timestamp
      if (!uniqueStocks.has(stock.ticker) || new Date(stock.timestamp) > new Date(uniqueStocks.get(stock.ticker)!.timestamp)) {
        uniqueStocks.set(stock.ticker, stock);
      }
    });
  
    // Convert Map values back to an array
    this.stockData = Array.from(uniqueStocks.values());
    //console.log('Filtered stock data:', this.stockData);
  }
}