import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockDisplayComponent } from './components/stock-display/stock-display.component';
import { StockService } from './services/stock-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StockDisplayComponent],
  // providers: [StockService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stock-market-app';
}
