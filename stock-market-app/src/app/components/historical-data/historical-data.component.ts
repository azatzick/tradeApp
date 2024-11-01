import { Component, Input, OnInit } from '@angular/core';
import { StockService } from '../../services/stock-service.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-historical-data',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss']
})
export class HistoricalDataComponent implements OnInit {
  chart: any;
  tickers = ['AAPL', 'GOOGL', 'TSLA', 'MSFT']; // List of tickers
  colors = ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA']; // Different shades of blue

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.fetchHistoricalData();
  }

  async fetchHistoricalData() {
    for (let i = 0; i < this.tickers.length; i++) {
      const ticker = this.tickers[i];
      const color = this.colors[i];
  
      try {
        const data = await this.stockService.getHistoricalData(ticker);

        // Check if data is valid
        if (data && data.timestamp && data.indicators?.quote?.[0]?.close) {
          // Convert timestamps to formatted dates
          const timestamps = data.timestamp.map((timestamp: number) => 
            this.formatDate(new Date(timestamp * 1000))
          );
          
          const prices = data.indicators.quote[0].close;

          // Update chart labels only once (for the first ticker)
          // Check if labels are set, otherwise assign the timestamps
          // Check if labels are set, otherwise assign the timestamps
        if (!this.chartData.labels || this.chartData.labels.length === 0) {
          this.chartData.labels = timestamps;
        }

          // Add each dataset with color and label
          this.chartData.datasets.push({
            label: ticker,
            data: prices,
            borderColor: color,
            fill: false,
          });
        } else {
          console.error(`Data for ${ticker} is missing required fields or is null.`);
        }
      } catch (error) {
        console.error(`Error fetching historical data for ${ticker}:`, error);
      }
    }
    this.createChart();
  }

  formatDate(date: Date): string {
    // Format to show only one label per month
    return `${date.toLocaleString('default', { month: 'short' })}.${date.getFullYear()}`;
  }

  createChart() {
    const ctx = document.getElementById('historicalChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Clear previous chart
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: {
        ...this.chartOptions,
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12 // Limit to one label per month
            }
          }
        }
      },
    });
  }
}