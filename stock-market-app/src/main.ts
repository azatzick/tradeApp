import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { StockService } from './app/services/stock-service.service';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
