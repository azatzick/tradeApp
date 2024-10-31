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
  @Input() ticker?: string;
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Price',
        data: [],
        borderColor: '#42A5F5',
        fill: false
      }
    ]
  };
  chartOptions: ChartOptions = { responsive: true };
  private chart: Chart | undefined;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    if (this.ticker) {
      this.fetchHistoricalData();
    }
  }

  createChart() {
    // Destroy the existing chart if it exists
    if (this.chart) {
        this.chart.destroy();
    }

    // Use the ticker symbol to select the correct canvas element
    const ctx = document.getElementById(this.ticker + 'Chart') as HTMLCanvasElement;
    if (!ctx) return; // Exit if canvas is not found

    this.chart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions
    });
}

  fetchHistoricalData() {
    if (!this.ticker) return;
    this.stockService.getHistoricalData(this.ticker).then((data) => {
        if (data && data.timestamp && data.indicators?.quote?.[0]?.close) {
            // Convert timestamps to "MMM.YYYY"
            this.chartData.labels = data.timestamp.map((timestamp: number) => {
                const date = new Date(timestamp * 1000);
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                return `${month}.${year}`;
            });
            
            // Get closing prices
            this.chartData.datasets[0].data = data.indicators.quote[0].close;

            this.createChart(); // Ensure chart is created with updated data
        } else {
            console.error("Unexpected data format:", data);
        }
    }).catch((error) => {
        console.error("Error fetching historical data:", error);
    });
}
}